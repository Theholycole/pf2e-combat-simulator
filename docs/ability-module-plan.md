# Ability module plan (draft)

Draft written 2026-10-07 while the user was away. It plans `pf2e-automatic-ability-resolution` (milestone 3). **Nothing here is built yet, and the open questions at the end are the user's to decide.**

## What it is

A sibling of the spell module that "works the same way" (the user's words). It compiles abilities into plans, carries them out in live play with chat cards and the GM-confirmation step, and registers them with the shared core so the simulator can use the same logic.

**Boundary (agreed):** anything that isn't a spell and doesn't cast, change or depend on a spell. For example:
- basic actions
- class features and feats
- monster abilities
- creature afflictions

Spellshapes, wands, staves, scrolls and item casting stay in the spell module. **Items** (non-spell consumables such as bombs, elixirs and potions, and weapons, armor and worn items) get their **own module, later** (the user, 2026-10-10); they were family 7 here and part of family 2 (healing potions, elixirs of life).

## Dependency

It needs `pf2e-resolution-core` (milestone 2) for the plan model, the shared primitives (conditions, damage, saves, durations, forced movement) and the apply layer. Until then, only work that doesn't need the core can start (see "Before the core exists").

**Milestone 2 status (from the spell-automation session, 2026-10-08):**

- **Timing:** the spell work is finished and committed (`3f519de` on `spell-automation-ranks-0-10`, including the retitle). The user then asked that session to clean up the spell module (remove dead and redundant code in the runtimes and `src/compiler`). **Nothing may be extracted until that session says the cleanup is done.** After that, milestone 2 starts whenever the user decides.
- **The core must own these before the ability module starts**, or PF2e functions would be wrapped twice and hooks would fire twice:
  - the `applyDamage` wrapper (`installDamageTypeMemory` in `scripts/item-spellshape-runtime.js`). It records damage types and the damage's item and actor, stamps them on PF2e's damage-taken message as `flags.pf2e-automatic-resolution.damageSource`, and marks a spell shield's Effect on Shield Block
  - the text-rules wrapper of `ItemPF2e#prepareRuleElements` (`scripts/text-rules.js`)
  - damage receipts (`native-damage-receipt.js`), forced movement (`forced-movement.js`), condition timing (`condition-timing.js`)
  - the ongoing-spell journal manager and its single-coordinator queue (`ongoing-runtime.js`, `ongoing-families.js`)
  - the convention that chat-card handlers skip messages carrying `flags.pf2e.context.type` (damage-taken and roll messages), so they don't re-trigger
- **Plan model:** the spell compiler's plans (`src/compiler`: `formatVersion` in the compiled report, `plan.resolution.kind` plus per-family blocks) are the base for the core's plan model.
- **Pure decision logic that already exists:** `basic-save-core.js`, `condition-spell-core.js`, `form-core.js`, `immediate-core.js`, `ongoing-core.js`, `affliction-care-core.js`, `strike-effects-core.js`. Most other runtimes work directly on Foundry documents and will be split family by family as the simulator needs them. Basic saves are already split.
- **Damage source tracking:** PF2e's damage-taken message has no origin. The `damageSource` flag above is what fills it in; the simulator's real-fight logger could use it later to attribute damage.

## Families, in order

The order comes from what the simulator misses most. It is based on the bestiary check of about 1,700 creatures (counts are from Monster Core) and on what PCs do every fight.

| # | Family | Examples | Why this order |
|---|---|---|---|
| 1 | Basic skill actions | Demoralize, Trip, Grapple, Shove, Escape, Reposition, Disarm, Feint | Every PC can use them. Demoralize drives the morale engine. Agreed as the first family. |
| 2 | Healing outside spells | Battle Medicine, healing potions, elixirs of life (Treat Wounds is out of combat: skipped) | **Moved up by the user (2026-10-08).** Milestone 1 has no healing at all, so PC death rates are overstated until it exists. |
| 3 | Monster attack effects | Grab (76), Improved Grab (22), Knockdown (23), Push (7), Constrict (22) | The most common monster gaps. Grab and Knockdown change who can act. |
| 4 | Monster area and big actions | Swallow Whole (21), Trample (19), Breath Weapon, swarm and troop area attacks | Swarms and troops can't attack at all in the simulator yet. |
| 5 | Common passives and reactions | Sneak Attack (35), Pack Attack (18), Fast Healing (15), Regeneration (15), Frightful Presence (26), Ferocity | Large damage and survival effects. Frightful Presence feeds morale. |
| 6 | Class features that add damage | Rage, Hunt Prey and Flurry, Power Attack, Double Slice, Sudden Charge, Exploit Vulnerability | The biggest reason the benchmark martial party underperforms. |
| 7 | ~~Bombs and other offensive consumables~~ | moved to the future item module (2026-10-10) | |
| 8 | Third-party set-asides | listed below | Handed over by the spell-automation session. |

### Third-party items the spell-automation session set aside for this module

From `PF2e AUTOMATIC SPELL RESOLUTION/docs/planning/third-party-features-audit.md` (read-only):

- **Magus+ martial list:** Bladebound, Battlemage's Apotheosis (and Ultimate Radiance), Starlit Span Light, Soul and Mind Essence Bolster, Sparkling Targe+, Wrought Warplating, Scourging Lash, Thousand-Touch Arcana, Diametric Fusion's twin trait, Spell Stitcher, Merged Martial Stance, Essence Tactics, Bargained Essence, Scent of Arcana, Discern Physicality, Perfect Arcane Form, Devouring Metal, Storm of the Winding Lash, Unbreakable Figure, Diametric Pairing, Sky Fall, Hundred Year Growth, Ablative Barrier Block, Arcane Conservation, Marionette Mastery, Jaunty Visage, Recharging Reload, Warded Stitch, hybrid-study stance bonuses, and Infinite Power Cascade (an eidolon's Strike).
- **Dragonbreath weapons (45) and spellguns:** the weapons' area-save activations, Howl of Winter and Verdant Bola.
- **Inventor and monk:** Unstable Magic Mastery, Battle Mediation and its stance, Flirting With Danger, Qi-Siphoning Blow.
- **Strike-delivered magus spells' extra versions:** Force Jaws, Splinter Shadow Assault, Elaborate Patterned Strike.

  Channel Smite+ and the seven Wizards+ slot-cost exploits were taken off this list on 2026-10-08. The user had them built in the spell module (batch 41, `scripts/plus-exploit-runtime.js`). PF2e's 107 catalysts were also automated there (batches 42–43), because they depend on spells.
- **Counteracts riding a Strike or class action:** Light Killer, Spellbreaking Charge, Phrenic Blood, Mana-Scrambling Feedback, Fortify Others.
- **Spell DC or spell attack, but not a spell:** 35 eidolon and companion abilities and 68 features.

## Before the core exists

Work that is safe now, without touching the spell module:

1. **A census of non-spell abilities** across PF2e's data, like the spell module's inventory. Counts by family and how many follow standard patterns ("on a hit, the target is grabbed").
2. **A plan-model design** for the shapes spells don't have: checks against a target's DC (Trip uses Athletics against Reflex DC), Strike riders, stances, once-per-round and per-target limits. This should be agreed with the spell-automation session so that it becomes part of the core rather than a second model.
3. **Tests from rules text** for family 1, ready for when the core lands.

## Kineticist: its own module (decided 2026-10-08)

The user chose to automate the Kineticist as **its own new module**, built on the spell automation and started in a separate session.

- Why Kineticist first: a probe of the spell compiler (`PF2e AUTOMATIC ABILITY RESOLUTION/tools/spell-compiler-probe.mjs`) found that impulses are the most spell-like non-spell content. 36% of the 118 compiled into rule plans with no changes, against 23% for monster abilities, 12% for consumables and 7% for PC feats.
- The user's instruction: build all of it, then test in Foundry.
- Kineticist content therefore leaves this module's scope.

## Decided (2026-10-08)

- Healing moves up to family 2.
- The census starts now, before the core exists. It lives in `PF2e AUTOMATIC ABILITY RESOLUTION/` and its first report is `docs/census.md`.
- **Live play is confirmation-first for everything**, like the spell module: every ability resolves through a chat card the GM confirms. Simple effects such as a Grab on a hit get a card too.
- **Third-party items stay as family 8.** None of them move up.

No open questions remain. The next step is the plan-model design for the shapes spells don't have. That needs to be agreed with the spell-automation session, because it becomes part of the shared core.
