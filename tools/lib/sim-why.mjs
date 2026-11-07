// (2026-11-07, the simulator phase — Cole: "focus on building the feats first then implementing them into the simulator then rating
// them in that order".) Feats whose trigger or use never comes up in a benchmark fight: the rating foes cast no spells and set no traps,
// nobody falls or watches, and no skill check outside a fight is rolled. partyWithFeat gives these as its reason, so the gap index and
// the final rating pass count them apart from the feats still to implement. Keyed by the feat's name; the reason is why.
const FOE_SPELL = "a reaction to a foe's spell or magical effect (the rating foes cast none)";
const FOE_TYPE = "a reaction to a kind of damage or effect the rating foes don't use (curses, poison, energy, visual effects)";
const SCENE = "a moment a fight on the simulator's open field never has (falling, spectators, traps, water, mounts in the air)";
const SKILL = "a reaction to a skill check made outside a fight's actions";
const GEAR = "a reaction to a misfire or gear the simulator doesn't play";
const DOOM = "a reaction to doom or an oracle's curse, which the simulator doesn't play";

export const SIM_WHY = Object.freeze({
    "Counter Curse": FOE_SPELL, "Counter Element": FOE_SPELL, "Mythic Counterspell": FOE_SPELL, "Master's Counterspell": FOE_SPELL,
    "Counterspell (Prepared)": FOE_SPELL, "Counterspell (Spontaneous)": FOE_SPELL, "Recognize Spell": FOE_SPELL, "Consume Magic": FOE_SPELL,
    "Counter Thought": FOE_SPELL, "Reflecting Riposte": FOE_SPELL, "Surging Interference": FOE_SPELL, "Interfering Surge": FOE_SPELL,
    "Absorb Spell": FOE_SPELL, "Challenge Insight": FOE_SPELL, "Burning Surge": FOE_SPELL, "Mirror Shield": FOE_SPELL, "Countercharm": FOE_SPELL,
    "Energetic Resonance": FOE_SPELL, "To Thine Own Self": FOE_SPELL,
    "Vacate Vision": FOE_TYPE, "Absorb Toxin": FOE_TYPE, "Poison Drinker": FOE_TYPE, "Alter Resistance": FOE_TYPE, "Conductor's Redirection": FOE_TYPE,
    "Contingency Leap": SCENE, "Cushion Landing": SCENE, "Air Cushion": SCENE, "Living for the Applause": SCENE, "Play to the Crowd": SCENE,
    "Everyone Duck!": SCENE, "Riptide": SCENE, "Guided Hover": SCENE,
    "Squawk!": SKILL, "Internal Dialogue": SKILL, "Watch and Learn": SKILL, "Read the Dust": SKILL, "Ward Casting": SKILL,
    "Instant Backup": GEAR,
    "Know Thy Doom": DOOM, "Scapegoat Parallel Self": DOOM
});
