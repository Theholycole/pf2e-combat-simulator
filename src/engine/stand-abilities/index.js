// (2026-11-24, Cole: "Sim each stand ability and rank them in power".) The 87 Stand Abilities of the PF2e Stand Class Archetype module
// (content/stand-abilities.md, with the 2026-11-24 buffs), each as a build: the plain close-range stand user (classes.js "stand-user", no
// Barrage Rush) with that ability in Flame's place — CLASSES "stand-ab-<slug>". One file a theme; each ability:
//   "Name": { build(ctx) → { spells, user, stand, spellPools } or null (no combat use), why: "…" (when null), notes: ["approximation", …] }
//   ctx: { lv, dc, attack, D(type), S(type), halfS(type), range, pool, make(name, opts), entry(name, plan, opts), savePlan, effectModel,
//          rounds(n), minutes(n), steps } — make() is the Flame helper (savePlan with the stand DC and its D/S formulas); entry() wraps a plan
//          of your own; user/stand are fields merged onto the user / its stand (arrays joined).
import { TIME } from "./time.js";
import { SPACE } from "./space.js";
import { MATTER } from "./matter.js";
import { FORCE } from "./force.js";
import { AFFLICTION } from "./affliction.js";
import { MIND } from "./mind.js";
import { FATE } from "./fate.js";

export const STAND_ABILITIES = Object.freeze({ ...TIME, ...SPACE, ...MATTER, ...FORCE, ...AFFLICTION, ...MIND, ...FATE });
// (Abilities only one stand type can take — the module's abilities.mjs LOCKED: that type's stand, its user beside it.)
export const STAND_ABILITY_TYPE = Object.freeze({ Disassemble: "automatic", "Melting Dart": "automatic", "Ice Armor": "integrated", "Devouring Flesh": "integrated" });
// (Forced use — the brief's rule: only actives the planner never picks. 2026-11-24 usage probe, 8 fights at each of 1/5/9/13/17/20: Face
// Blindness's only active, its surge, was never picked — its "allyless" state is worth nothing to the planner.)
export const STAND_ABILITY_FORCED = Object.freeze(["Face Blindness"]);
// (Abilities that can turn a bystander into a weapon — played with 2 commoners and 2 Tiny animals at hand, ctx.convert.)
export const STAND_ABILITY_BYSTANDERS = Object.freeze(["Dinosaurify", "Storybook", "Fog Puppets", "Puppet Marks", "Memory Discs", "Rage Field"]);
export const standAbilitySlug = (name) => `stand-ab-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
