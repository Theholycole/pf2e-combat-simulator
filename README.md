# PF2e Combat Simulator

A GM-only Foundry VTT module (Foundry 14, PF2e 8.5) that plays an encounter in memory many times and reports the odds. Nothing on the canvas moves and no actor changes.

- **Simulate…** (Combat Tracker): set up the encounter (sides, roles, morale, reinforcements, ambush, cover, a secondary objective), then:
  - **Simulate**: win %, objective %, PC danger, the most dangerous foe, a sample fight log, and what isn't simulated yet.
  - **Compare**: the same fights with morale, hero points, the objective or party retreat switched off.
  - **Morale rule impact**: every morale rule switched off in turn and ranked by how much it changes the outcome.
- **Odds** (Combat Tracker): the fight as it stands right now, 200 fights in about half a second (never more than about 2.5 s), whispered to the GM. **What would change the odds?** then tries making each kind of foe Weak or Elite, or removing one.
- **Simulate selected tokens**: shown when there is no encounter.
- **Real-fight log**: when an encounter with a player-owned PC begins, the odds are predicted quietly. When it ends, you're asked how it went. The log window (module settings, or the Simulate window) shows how well predictions matched reality. You can switch it off with the "Log real fights" setting.
- Macro API: `game.modules.get("pf2e-combat-simulator").api.open()`, `.oddsCheck()` and `.openLog()`.
- **Spells** (milestone 2): creatures cast the spells the resolution core can resolve: saves and spell attacks, with their damage, conditions and push or pull. Everything else is listed as a gap. It needs the `pf2e-resolution-core` module, and the spell module for the plans.

The design is in [docs/spec.md](docs/spec.md) and the vocabulary in [CONTEXT.md](CONTEXT.md). The rules choices the user confirmed are in [docs/morale-decisions.md](docs/morale-decisions.md) (morale) and [docs/spell-decisions.md](docs/spell-decisions.md) (spellcasting).

## Development

- `node --test` runs the engine, rules, benchmark and adapter tests.
- `src/engine/` is pure JavaScript with no Foundry dependency. It runs in a Web Worker in Foundry and in Node for tests.
- `scripts/` is the Foundry layer:
  - `snapshot.js` is the only file that reads PF2e documents
  - `app.js` and `odds.js` are the UI
  - `runner.js` handles the worker
- `src/adapter/formula.js` parses PF2e's readable damage formulas. It has been checked against all 1,027 Monster Core Strike formulas.
- `src/engine/spells.js` imports the core's pure code from `../../../pf2e-resolution-core/`. The core's sibling alias in `~/Documents/ChatGPT` makes that path work in Node too.
- `node tools/bestiary-casters.mjs [pack …]` runs every bestiary spellcaster's spells through the simulator and reports what's cast, what's missing and any errors.
