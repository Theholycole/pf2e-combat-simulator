// A creature's preferences (2026-10-23, the user: "an extra info icon next to monster names in the compendium browser. When the mouse
// hovers over this i want it to show a Monsters preferred battlefield type as well as 3 beneficial things they want the most they dont
// already have and 3 detrimental things they hate the most … simulate each monster for battlefields, external benefits and detrimental
// preferences that will raise or lower their deadliness the most"; their choices: light and weather, the party's damage types, terrain and
// cover, and other creatures' spells and abilities that work well with it — "the spell resist energy and a monster weak to energy damage";
// 40 fights each).
//   Each factor is a change to the danger fights (danger-scale.js: the standard party of its level against it): its worth, how much more
// (or less) dangerous for its level the creature fights with it — effective levels on the danger ratings' scale, over the same seeds as
// the fights without it (a battlefield's against the open field on the grid, the bands' fights being 30 feet closer). Pure: the catalog,
// what each does to the combatants and the setup, and the picks.

export const PREFERENCE_FIGHTS = 40;

const BATTLEFIELD_NAMES = ["balconies", "broken", "burrows", "dropoff", "gates", "high-low", "narrow-path", "obscura", "one-mass", "pillars", "rampart", "sky", "underwater"];
const BATTLEFIELD_LABELS = { balconies: "Balconies", broken: "Broken Ground", burrows: "Burrows", dropoff: "Dropoff", gates: "Gates", "high-low": "High and Low", "narrow-path": "Narrow Path", obscura: "Obscura", "one-mass": "One Mass", pillars: "Pillars", rampart: "Rampart", sky: "Sky", underwater: "Underwater" };
const ENERGY = ["fire", "cold", "electricity", "acid", "sonic", "vitality", "void", "force", "spirit", "mental", "poison"];
const TERRAIN = { plants: "undergrowth", swamp: "swamp", snow: "snow", ice: "ice", water: "shallow water", rubble: "rubble", sand: "sand" };

// (Resist Energy's choices: acid, cold, electricity, fire, sonic.)
const RESISTIBLE = ["acid", "cold", "electricity", "fire", "sonic"];
const weakTo = (monster) => [...new Set((monster.weaknesses ?? []).map((entry) => entry.type).filter((type) => RESISTIBLE.includes(type)))];
// The damage types, materials and traits a creature's immunities, resistances, weaknesses (and their exceptions) and regeneration name —
// those whose damage does something different to it (vitality to the undead too); any other does what any damage would.
export function namedTypes(monster) {
    const out = new Set();
    for (const entry of monster?.immunities ?? []) out.add(typeof entry === "string" ? entry : entry?.type);
    for (const entry of [...(monster?.resistances ?? []), ...(monster?.weaknesses ?? [])]) {
        out.add(entry?.type);
        for (const exception of entry?.exceptions ?? []) out.add(typeof exception === "string" ? exception : exception?.type);
    }
    for (const type of monster?.regeneration?.deactivatedBy ?? []) out.add(type);
    if ((monster?.traits ?? []).includes("undead")) out.add("vitality");
    out.delete(undefined);
    return out;
}

// The party's Strikes with something added: a damage die of a type (a property rune's 1d6), a material or a trait.
const withStrikes = (change) => (member) => ({ ...member, strikes: (member.strikes ?? []).map(change) });
const addDamage = (type) => withStrikes((strike) => ({ ...strike, damage: [...(strike.damage ?? []), { dice: 1, die: 6, bonus: 0, type }] }));
const addIwr = (field, value) => withStrikes((strike) => ({ ...strike, iwr: { ...(strike.iwr ?? {}), [field]: [...new Set([...(strike.iwr?.[field] ?? []), value])] } }));
// The party's conditions as the fight starts (another creature's doing: a Frightful Presence, a stench, a hex — PF2e's lasting ones kept).
const partyCondition = (slug, value) => (member) => ({ ...member, conditions: { ...(member.conditions ?? {}), [slug]: value } });

// Each factor: key, label (as the tooltip says it), group, and what it does — grid (a battlefield's layout), environment and cover (the
// setup's), party (each party member), spell (an ally's spell on the creature as the fight starts: tools resolve its plan), base (the
// factor it's measured against: a battlefield's the open grid; Resist Energy's the party dealing that type), applies (whether it's one
// the creature doesn't already have).
export function factorsFor(monster) {
    const flies = Boolean(monster?.flies);
    const named = namedTypes(monster);
    const spells = new Set((monster?.spells ?? []).map((entry) => String(entry.name ?? "").replace(/\s*\(.*\)$/, "").toLowerCase()));
    const own = (name) => spells.has(name.toLowerCase());
    const list = [
        ...BATTLEFIELD_NAMES.map((name) => ({ key: `battlefield:${name}`, label: BATTLEFIELD_LABELS[name], group: "battlefield", grid: { layout: name }, base: "grid:open", applies: name !== "sky" || flies, ...(name === "sky" ? { party: (member) => ({ ...member, flies: true, flySpeed: member.speed ?? 25 }) } : name === "underwater" ? { party: (member) => ({ ...member, traits: [...new Set([...(member.traits ?? []), "amphibious"])] }) } : {}) })),
        { key: "light:dim", label: "dim light", group: "light", environment: { light: "dim" } },
        { key: "light:dark", label: "darkness", group: "light", environment: { light: "dark" }, applies: !own("darkness") },
        { key: "light:sunlight", label: "sunlight", group: "light", environment: { light: "bright", sunlight: true } },
        // (Fog and heavy rain play the same — concealment for all; falling snow too, but for one with snow vision.)
        { key: "weather:fog", label: "fog or heavy rain", group: "light", environment: { weather: "fog" } },
        { key: "weather:snow", label: "falling snow", group: "light", environment: { weather: "snow" }, applies: Boolean(monster?.snowVision) },
        // (A type's damage — a property rune's 1d6 on each of the party's Strikes — against the same 1d6 untyped; only the types it names.)
        { key: "deals:untyped", label: "untyped damage", group: "base", party: addDamage("untyped"), applies: ENERGY.some((type) => named.has(type)) },
        ...ENERGY.map((type) => ({ key: `deals:${type}`, label: `${type} damage`, group: "damage", party: addDamage(type), base: "deals:untyped", applies: named.has(type) })),
        { key: "deals:silver", label: "silver weapons", group: "damage", party: addIwr("materials", "silver"), applies: named.has("silver") },
        { key: "deals:cold-iron", label: "cold iron weapons", group: "damage", party: addIwr("materials", "cold-iron"), applies: named.has("cold-iron") },
        { key: "deals:holy", label: "holy weapons", group: "damage", party: addIwr("traits", "holy"), applies: named.has("holy") },
        { key: "deals:unholy", label: "unholy weapons", group: "damage", party: addIwr("traits", "unholy"), applies: named.has("unholy") },
        // (Difficult ground halves the Speed of all but a flier and one with the stride for it: on the open field on the grid — in the
        // bands' fights, begun near, it hardly mattered. Without a stride every kind plays the same: one factor, and one more for each kind
        // it has a stride for.)
        { key: "terrain:difficult", label: "difficult ground", group: "terrain", grid: { layout: "open" }, environment: { difficult: "rubble" }, base: "grid:open" },
        ...(monster?.terrainStride ?? []).filter((kind) => TERRAIN[kind]).map((kind) => ({ key: `terrain:${kind}`, label: TERRAIN[kind], group: "terrain", grid: { layout: "open" }, environment: { difficult: kind }, base: "grid:open" })),
        { key: "cover:foes", label: "cover", group: "terrain", cover: { foes: 2 } },
        { key: "cover:foes-greater", label: "greater cover", group: "terrain", cover: { foes: 4 } },
        { key: "cover:party", label: "the party in cover", group: "terrain", cover: { party: 2 } },
        { key: "ally:haste", label: "an ally's Haste", group: "ally", spell: "Haste", applies: !own("haste") },
        { key: "ally:heroism", label: "an ally's Heroism", group: "ally", spell: "Heroism", applies: !own("heroism") },
        { key: "ally:fly", label: "an ally's Fly", group: "ally", spell: "Fly", applies: !flies && !own("fly") },
        { key: "ally:invisibility", label: "an ally's Invisibility", group: "ally", spell: "Invisibility", applies: !own("invisibility") && !(monster?.traits ?? []).includes("invisible") },
        { key: "ally:blur", label: "an ally's Blur", group: "ally", spell: "Blur", applies: !own("blur") },
        { key: "ally:mirror-image", label: "an ally's Mirror Image", group: "ally", spell: "Mirror Image", applies: !own("mirror image") },
        { key: "ally:enlarge", label: "an ally's Enlarge", group: "ally", spell: "Enlarge", applies: !own("enlarge") },
        ...weakTo(monster).map((type) => ({ key: `ally:resist-${type}`, label: `an ally's Resist Energy (${type})`, group: "ally", spell: "Resist Energy", base: `deals:${type}`, party: addDamage(type) })),
        { key: "ally:frightened", label: "an ally's Frightful Presence", group: "ally", party: partyCondition("frightened", 2) },
        { key: "ally:sickened", label: "an ally's stench", group: "ally", party: partyCondition("sickened", 1) },
        { key: "ally:enfeebled", label: "an ally's enfeebling hex", group: "ally", party: partyCondition("enfeebled", 1) },
        { key: "ally:clumsy", label: "an ally's clumsying hex", group: "ally", party: partyCondition("clumsy", 1) },
        { key: "ally:flanking", label: "an ally to flank with", group: "ally", party: partyCondition("offGuard", true) }
    ];
    return list.filter((factor) => factor.applies !== false);
}

// The keys a creature's preferences are measured against (no factor: the danger fights; "grid:open": the same on the open field).
export const BASES = ["none", "grid:open"];

// A factor's fight: the combatants and the setup, from the party and the foes (spell: the ally's spell entry, resolved).
export function factorFight(factor, party, foes, { spell = null } = {}) {
    const members = factor?.party ? party.map(factor.party) : party;
    const [monster, ...rest] = foes;
    const buffed = spell ? { ...monster, spells: [...(monster.spells ?? []), { ...spell, name: `${spell.name} (Constant)`, pool: null }] } : monster;
    const setup = {
        ...(factor?.environment ? { environment: { ...factor.environment } } : {}),
        ...(factor?.cover ? { cover: { party: 0, foes: 0, ...factor.cover } } : {}),
        ...(factor?.grid ? { grid: factor.grid } : {})
    };
    return { combatants: [...members, buffed, ...rest], setup };
}

// What a creature's numbers say ({ key: worth in levels }): its battlefield (the best, any worth), and the three it gains most from and the
// three it loses most to, past noise (minimum, in levels: 0.3 — with 40 fights, a factor that does nothing comes out within about a fifth
// of a level either way), battlefields and bases aside (by their keys).
export function picksOf(worth, { minimum = 0.3 } = {}) {
    const entries = Object.entries(worth).filter(([, value]) => Number.isFinite(value));
    const battlefields = entries.filter(([key]) => key.startsWith("battlefield:")).sort((a, b) => b[1] - a[1]);
    const others = entries.filter(([key]) => !key.startsWith("battlefield:") && key !== "deals:untyped");
    const round = ([key, value]) => [key, Math.round(value * 10) / 10];
    // (An ally's help is only ever wanted: it can be turned down — one that does worse with it is the planner playing it worse, not a
    // dislike.)
    return {
        battlefield: battlefields[0] ? round(battlefields[0]) : null,
        wants: others.filter(([, value]) => value >= minimum).sort((a, b) => b[1] - a[1]).slice(0, 3).map(round),
        hates: others.filter(([key, value]) => value <= -minimum && !key.startsWith("ally:")).sort((a, b) => a[1] - b[1]).slice(0, 3).map(round)
    };
}

// The labels, for the data file and the tooltip.
export function factorLabels() {
    const everything = { weaknesses: ENERGY.map((type) => ({ type })), immunities: ["silver", "cold-iron", "holy", "unholy"], snowVision: true, terrainStride: Object.keys(TERRAIN) };
    const all = [...factorsFor({ ...everything, flies: true }), ...factorsFor(everything)];
    return Object.fromEntries(all.filter((factor) => factor.group !== "base").map((factor) => [factor.key, factor.label]));
}
