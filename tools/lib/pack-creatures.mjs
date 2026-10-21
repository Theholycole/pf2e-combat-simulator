// The bestiary creatures as the simulator's combatants, read from PF2e's packs (and Battlezoo's): their stat blocks, the abilities the
// ability module compiles, the basic actions they're trained for, and their summons' creatures as reserves. Shared by the bestiary
// tools (bestiary-abilities.mjs, deadliest.mjs).
const { readDocuments } = await import(new URL("../../../PF2e AUTOMATIC ABILITY RESOLUTION/tools/leveldb.mjs", import.meta.url).href);
const { compileBasicActions, compileMonsterAbility } = await import(new URL("../../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/index.js", import.meta.url).href);
const { initiativeSkills } = await import(new URL("../../../PF2e AUTOMATIC ABILITY RESOLUTION/src/compiler/initiative.js", import.meta.url).href);
const { zoneSpell } = await import("../../src/engine/zones.js");
const { parseReadableDamage, randomDamageRows } = await import("../../src/adapter/formula.js");
const { addBuiltin, PLAYED_REQUIRES, predicateOptions } = await import("../../src/engine/abilities.js");
const { requirementPlayable } = await import("../../src/engine/needs.js");
const { markParts, toggleWays } = await import("../../src/engine/toggles.js");
const { effectModel, iwrException } = await import("../../src/engine/effects.js");
const { SUMMON_LEVELS } = await import("../../src/engine/summons.js");
const { immunityExceptions } = await import("../../src/engine/immunities.js");
const { asReserve, bestOption, bestPick, reserveCount } = await import("../../src/engine/summons.js");
const { eliteAdjust, weakAdjust } = await import("../../src/engine/adjust.js");
const { strikeIwr, versatileTypes } = await import("../../src/engine/damage.js");

export const PACK_ROOT = `${process.env.HOME}/.local/share/FoundryVTT/Data/systems/pf2e/packs`;
// (T6: PF2e's weapons by name and slug → their group, for an NPC attack named after one.)
const WEAPON_GROUPS = new Map();
// (A weapon's ammunition, PF2e's ammo base type — "arrows" for a longbow.)
const WEAPON_AMMO = new Map();
for (const doc of readDocuments(`${PACK_ROOT}/equipment`).filter((entry) => entry.collection === "items" && entry.type === "weapon" && entry.system?.group)) {
    WEAPON_GROUPS.set(String(doc.name).toLowerCase(), doc.system.group);
    if (doc.system.slug) WEAPON_GROUPS.set(doc.system.slug, doc.system.group);
    if (doc.system.ammo?.baseType) for (const key of [String(doc.name).toLowerCase(), doc.system.slug].filter(Boolean)) WEAPON_AMMO.set(key, doc.system.ammo.baseType);
}
const weaponAmmo = (item, weapon) => weapon?.system?.ammo?.baseType ?? WEAPON_AMMO.get(String(item.name).toLowerCase()) ?? WEAPON_AMMO.get(String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")) ?? null;
const weaponGroup = (item, traits) => (traits.includes("unarmed") ? "brawling" : WEAPON_GROUPS.get(String(item.name).toLowerCase()) ?? WEAPON_GROUPS.get(String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")) ?? null);
export const basicActions = compileBasicActions(readDocuments(`${PACK_ROOT}/actions`).filter((doc) => doc.collection === "items"));
const SKILL_OF = { demoralize: "intimidation", trip: "athletics", grapple: "athletics", shove: "athletics", disarm: "athletics", reposition: "athletics", feint: "deception", "create-a-diversion": "deception", "administer-first-aid": "medicine" };
const heldWeapon = (npc, item) => Boolean(item.flags?.pf2e?.linkedWeapon) || npc.items.some((entry) => entry.type === "weapon" && entry.name.toLowerCase() === item.name.toLowerCase())
    || WEAPON_GROUPS.has(String(item.name).toLowerCase()) || WEAPON_GROUPS.has(String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, "-"));

// PF2e's effect items by UUID (Compendium.pf2e.bestiary-effects.Item.…), read from their packs once.
const effectPacks = new Map();
function effectItem(uuid) {
    const [, system, pack, id] = /^Compendium\.([\w-]+)\.([\w-]+)\.Item\.([A-Za-z0-9]{16})$/.exec(uuid) ?? [];
    if (system !== "pf2e") return null;
    if (!effectPacks.has(pack)) {
        let docs = [];
        try {
            docs = readDocuments(`${PACK_ROOT}/${pack}`).filter((doc) => doc.collection === "items");
        } catch {
            docs = [];
        }
        effectPacks.set(pack, new Map(docs.map((doc) => [doc._id, doc])));
    }
    return effectPacks.get(pack).get(id) ?? null;
}
// The models of the effects an effect plan applies (a monster's Battle Cry), at its level.
function effectModels(plan, level) {
    const models = {};
    // (2026-10-20: and the Effects an affliction's stages link, "Effect: Grit (Stage 1)".)
    const uuids = [...(plan?.resolution?.kind === "effect" ? plan.resolution.applications ?? [] : []).map((application) => application?.uuid), ...Object.values(plan?.resolution?.outcomes ?? {}).flatMap((row) => (row?.nativeEffects ?? []).map((native) => native?.uuid)), ...(plan?.resolution?.afflictionHandoff?.stages ?? []).flatMap((stage) => (stage?.effects ?? []).map((effect) => effect?.uuid))];
    for (const uuid of uuids.filter(Boolean)) {
        const item = effectItem(uuid);
        if (item) models[uuid] = effectModel(item, { rank: level });
    }
    return models;
}

// The resistances, weaknesses or immunities its items' rules add without a condition, one for each type a rule lists.
function ruleIwr(npc, key) {
    const rules = npc.items.flatMap((item) => (item.system?.rules ?? []).filter((rule) => rule?.key === key && !rule.predicate?.length && rule.mode !== "remove" && rule.type && (key === "Immunity" || Number.isFinite(Number(rule.value)))));
    return rules.flatMap((rule) => [].concat(rule.type).map((type) => ({ ...rule, type, ...(key === "Immunity" ? {} : { value: Number(rule.value) }) })));
}

// The options a creature's rules turn on as it is: a RollOption without a predicate that isn't a toggle, or a toggle on by default — of
// those its predicates name.
function defaultOptions(npc, predicates) {
    const named = new Set(predicateOptions(predicates.filter(Boolean)));
    if (!named.size) return [];
    const on = npc.items.flatMap((item) => (item.system?.rules ?? []).filter((rule) => rule?.key === "RollOption" && !rule.predicate?.length && (rule.toggleable ? rule.value === true : true)).map((rule) => rule.option));
    return [...new Set(on.filter((option) => named.has(option)))];
}

// A raw NPC (pack data) as an engine combatant.
export function combatant(npc) {
    const system = npc.system;
    const strikes = [];
    const bombStock = {};
    // (B255: a Strike with no damage of its own, for an ability that gives it a table of damage — Generate Bomb's bomb.)
    const bare = [];
    for (const item of npc.items.filter((entry) => entry.type === "melee")) {
        const traits = item.system.traits?.value ?? [];
        const damage = Object.values(item.system.damageRolls ?? {}).flatMap((roll) => parseReadableDamage(`${roll.damage} ${roll.category === "persistent" ? "persistent " : roll.category === "splash" ? "splash " : ""}${roll.damageType ?? "untyped"}`));
        if (!damage.length) bare.push(item);
        if (!damage.length) continue;
        const increment = Number(traits.find((trait) => /^range-increment-\d+$/.test(trait))?.split("-").pop()) || Number(traits.find((trait) => /^range-\d+$/.test(trait))?.split("-").pop()) || null;
        // (U2: a bomb its Strike links to: as many as it carries, taken out before each throw unless held or with Quick Bomber.)
        const weapon = npc.items.find((entry) => entry.type === "weapon" && entry._id === item.flags?.pf2e?.linkedWeapon);
        const bomb = Boolean(weapon) && traits.includes("bomb") && (weapon.system?.traits?.value ?? []).includes("consumable");
        const quickBomber = bomb && npc.items.some((entry) => ["action", "feat"].includes(entry.type) && (entry.system?.slug ?? entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) === "quick-bomber");
        if (bomb) bombStock[`item:${weapon._id}`] = Number(weapon.system?.quantity ?? 1) || 0;
        strikes.push({
            name: item.name,
            bonus: item.system.bonus?.value ?? 0,
            melee: !increment,
            increment,
            agile: traits.includes("agile"),
            // (B308: holy or unholy, for a reaction to damage of that trait.)
            ...(traits.includes("holy") || traits.includes("good") ? { holy: true } : {}), ...(traits.includes("unholy") || traits.includes("evil") ? { unholy: true } : {}),
            ...(traits.includes("sanctified") ? { sanctified: true } : {}), ...(traits.includes("twin") ? { twin: true } : {}),
            // (I2: what its damage carries for weaknesses and resistances; T6: its weapon group as PF2e gives it — brawling for an unarmed
            // attack, a weapon's by its name.)
            ...(strikeIwr(traits, { name: item.name, group: weaponGroup(item, traits) }) ? { iwr: strikeIwr(traits, { name: item.name, group: weaponGroup(item, traits) }) } : {}),
            ...(versatileTypes(traits).length ? { versatile: versatileTypes(traits) } : {}),
            unarmed: traits.includes("unarmed"),
            reach: Number(traits.find((trait) => /^reach-\d+$/.test(trait))?.split("-")[1]) || 5,
            damage,
            attackEffects: item.system.attackEffects?.value ?? [],
            // (B313: a weapon in hand — one PF2e links to a weapon item, shares a name with the creature's weapon or with one of PF2e's
            // weapons; not a lava bomb, a force blast or a rock.)
            held: !traits.includes("unarmed") && heldWeapon(npc, item),
            // As the live snapshot reads them (C14, C16).
            ...(Number(traits.find((trait) => /^reload-\d+$/.test(trait))?.split("-")[1]) > 0 ? { reload: Number(traits.find((trait) => /^reload-\d+$/.test(trait)).split("-")[1]) } : {}),
            ...(traits.includes("concussive") ? { concussive: true } : {}),
            ...(weaponAmmo(item, weapon) ? { ammoType: weaponAmmo(item, weapon) } : {}),
            // (As the live snapshot: a firearm or a crossbow for the gunslinger's and "firearm Strike" abilities — before 2026-10-16 none
            // offline; U14: a crossbow marked, not a firearm for a spellgun.)
            ...(["firearm", "crossbow"].includes(weaponGroup(item, traits)) ? { firearm: true } : {}),
            ...(weaponGroup(item, traits) === "crossbow" ? { crossbow: true } : {}),
            ...(traits.includes("splash") ? { splashKind: "bomb" } : traits.some((trait) => /^scatter-\d+$/.test(trait)) ? { splashKind: "scatter" } : {}),
            ...(bomb ? { ammo: { pool: `item:${weapon._id}`, count: bombStock[`item:${weapon._id}`], reagents: false, startsEmpty: !quickBomber && weapon.system?.equipped?.carryType !== "held" }, consumable: true, ...(quickBomber ? {} : { reload: 1 }) } : {})
        });
    }
    const spells = [];
    const builtins = { reactions: { aoo: false, shieldBlock: false } };
    const used = new Set();
    // (As the live snapshot does: "Frequency once per day", per hour, per minute — that many uses in the fight; once a turn or a round isn't
    // limited here. Before 2026-10-13 the bestiary tools didn't hold an ability to its frequency.)
    const frequencyUses = {};
    for (const item of npc.items.filter((entry) => entry.type === "action")) {
        const plan = compileMonsterAbility(item, { basicActions, actor: npc });
        // (B312: not with a requirement the ability module couldn't read, as the live snapshot.)
        if (!plan || plan.requirementUnread) continue;
        const frequency = item.system?.frequency;
        const limited = frequency?.max && !["turn", "round"].includes(frequency.per) ? `frequency:${item._id}` : null;
        if (limited) frequencyUses[limited] = Number(frequency.value ?? frequency.max) || 1;
        // (B303: more reactions a reaction grants with itself.)
        if (plan.reactions && plan.builtin !== "passive-rules") addBuiltin(builtins, { builtin: "passive-rules", reactions: plan.reactions }, item.name);
        // Used in one of several ways (two breath weapons): each way, sharing the ability's recharge.
        // (B255: a random effect table — one ability, its die picking the way when used; a way it can't play does nothing.)
        if (plan.builtin === "modes" && plan.random) {
            const ways = plan.modes.filter((mode) => mode.plan?.resolution || mode.again);
            const shown = ways.find((mode) => mode.plan?.resolution);
            if (!shown) continue;
            used.add(item.name);
            spells.push({ name: item.name, plan: shown.plan, castRank: 1, pool: limited, kind: "ability", rechargeGroup: item.name, die: Number(/^(?:\d+)d(\d+)$/.exec(plan.random.formula)?.[1]) || 1, dice: Number(/^(\d+)d\d+$/.exec(plan.random.formula)?.[1]) || 1, randomWays: plan.modes.map((mode) => ({ name: mode.name, faces: mode.faces, plan: mode.plan?.resolution ? mode.plan : null, ...(mode.again ? { again: mode.again } : {}) })) });
        } else if (plan.builtin === "modes") {
            // (B286: not with a requirement the simulation can't check — the ability's own or a way's.)
            const unmet = (entry) => !requirementPlayable(entry, PLAYED_REQUIRES);
            if (unmet(plan)) continue;
            const ways = plan.modes.filter((mode) => mode.plan?.resolution && !unmet(mode.plan));
            if (ways.length) used.add(item.name);
            for (const mode of ways) spells.push({ name: `${item.name} (${mode.name})`, plan: mode.plan, castRank: 1, pool: limited, kind: "ability", rechargeGroup: item.name });
            // (B307: ways that are zones — Trail of Runes: each a zone ability, sharing the ability's recharge.)
            let zoned = false;
            for (const mode of ways.length ? [] : plan.modes.filter((entry) => entry.plan?.builtin === "zone")) {
                const way = { ...mode.plan, actions: mode.plan.actions ?? plan.actions };
                const effectModel = way.zone.effect ? effectModels({ resolution: { outcomes: { success: { nativeEffects: [way.zone.effect] } } } }, system.details.level.value)[way.zone.effect.uuid] ?? null : null;
                const effects = Object.assign({}, ...(way.zone.saves ?? []).map((save) => effectModels(save.plan, system.details.level.value)));
                const spell = zoneSpell(`${item.name} (${mode.name})`, way, { effectModel, effects });
                if (!spell) continue;
                zoned = true;
                spells.push({ ...spell, pool: limited, rechargeGroup: item.name });
            }
            if (zoned) {
                used.add(item.name);
                continue;
            }
            // (B307: a choice PF2e holds as a toggle: its ways from the creature's rules.)
            const toggle = !ways.length && plan.modes.length && plan.modes.every((mode) => mode.plan?.builtin === "roll-option") ? toggleWays(npc.items, plan, item.name) : null;
            if (toggle) {
                builtins.toggles = [...(builtins.toggles ?? []), ...toggle];
                used.add(item.name);
                continue;
            }
            // (B273: ways that are builtins — stances, self-effects, sweeps — the first one, as the creature's choice.)
            const built = ways.length ? null : plan.modes.find((mode) => mode.plan?.builtin && !["no-effect", "modes"].includes(mode.plan.builtin));
            if (built && addBuiltin(builtins, built.plan, item.name)) used.add(item.name);
        } else if (plan.builtin === "zone") {
            // (B256: an area that lasts — one ability, its zone played over the turns.)
            const effectModel = plan.zone.effect ? effectModels({ resolution: { outcomes: { success: { nativeEffects: [plan.zone.effect] } } } }, system.details.level.value)[plan.zone.effect.uuid] ?? null : null;
            const effects = Object.assign({}, ...(plan.zone.saves ?? []).map((save) => effectModels(save.plan, system.details.level.value)));
            const spell = zoneSpell(item.name, plan, { effectModel, effects });
            if (spell) {
                used.add(item.name);
                spells.push({ ...spell, pool: limited, rechargeGroup: item.name });
            }
        } else if (plan.builtin === "no-effect" && plan.gm) {
            // (The GM's, 2026-10-12: not played here.)
        } else if (plan.builtin === "hunt-prey" && !plan.edge && plan.toggle) {
            // (B308: a mark whose bonus is its toggle's rules.)
            const parts = markParts(npc.items, plan.toggle);
            if (parts.length) {
                builtins.huntPrey = { edge: "parts", parts, every: true };
                used.add(item.name);
            }
        } else if (plan.builtin) {
            // (Its traits with it, for a Strike activity's concentrate.)
            if (addBuiltin(builtins, { ...plan, traits: plan.traits ?? [...(item.system?.traits?.value ?? [])] }, item.name)) used.add(item.name);
        } else if (plan.resolution && requirementPlayable(plan, PLAYED_REQUIRES)) {
            used.add(item.name);
            // (B230: once a fight in its words; B262: its recharge by name, shared when it says so.)
            spells.push({ name: item.name, plan, castRank: 1, pool: limited ?? (plan.oncePerFight ? `once:${item.name}` : null), kind: "ability", rechargeGroup: plan.sharesRecharge ?? item.name, effects: effectModels(plan, system.details.level.value) });
        }
    }
    // (B255: the table on its Strike — the damage a die picks, its splash as a bomb's.)
    for (const table of builtins.randomStrikeTables ?? []) {
        const item = bare.find((entry) => entry.name.toLowerCase() === String(table.strike).toLowerCase());
        const rows = randomDamageRows(table);
        const shown = rows.find((row) => row.damage.length);
        if (!item || !shown) continue;
        const traits = item.system.traits?.value ?? [];
        const increment = Number(traits.find((trait) => /^range-increment-\d+$/.test(trait))?.split("-").pop()) || Number(traits.find((trait) => /^(?:range|thrown)-\d+$/.test(trait))?.split("-").pop()) || null;
        strikes.push({ name: item.name, bonus: item.system.bonus?.value ?? 0, melee: !increment, increment, agile: traits.includes("agile"), reach: Number(traits.find((trait) => /^reach-\d+$/.test(trait))?.split("-")[1]) || 5, damage: shown.damage, attackEffects: [], held: !traits.includes("unarmed") && heldWeapon(npc, item), randomDamage: rows, randomDie: table.die, ...(rows.some((row) => row.damage.some((part) => part.splash)) ? { splashKind: "bomb" } : {}) });
    }
    delete builtins.randomStrikeTables;
    const skills = Object.fromEntries(Object.entries(system.skills ?? {}).map(([slug, value]) => [slug, value.base ?? 0]));
    for (const [slug, plan] of Object.entries(basicActions)) {
        if (SKILL_OF[slug] && !(SKILL_OF[slug] in skills)) continue;
        spells.push({ name: plan.source.name, plan, castRank: 1, pool: null, kind: "basic" });
    }
    const hp = system.attributes.hp.max;
    return {
        id: "monster",
        name: npc.name,
        side: "foes",
        kind: "npc",
        level: system.details.level.value,
        traits: system.traits.value ?? [],
        // (M38: one that speaks a language can offer to surrender.)
        languages: system.details?.languages?.value ?? [],
        hp: { value: hp, max: hp },
        ac: system.attributes.ac.value,
        // (B302: PF2e takes a creature's Hardness off all its damage.)
        hardness: system.attributes.hardness?.value ?? 0,
        spellPools: { ...Object.fromEntries(spells.filter((spell) => spell.pool).map((spell) => [spell.pool, 1])), ...frequencyUses, ...bombStock },
        saves: { fortitude: system.saves.fortitude.value, reflex: system.saves.reflex.value, will: system.saves.will.value },
        perception: system.perception?.mod ?? 0,
        // (L1, L3: its senses and whether it flies.)
        senses: [...new Set((system.perception?.senses ?? []).map((sense) => (typeof sense === "string" ? sense : sense?.type)).filter(Boolean))],
        ...((system.attributes.speed?.otherSpeeds ?? []).some((speed) => speed?.type === "fly" && Number(speed.value) > 0) ? { flies: true } : {}),
        skills,
        // (B303: the skills its abilities name for its own initiative.)
        initiativeSkills: [...new Set(npc.items.filter((entry) => ["action", "feat"].includes(entry.type)).flatMap((entry) => initiativeSkills(entry)))],
        speed: system.attributes.speed?.value ?? 25,
        reach: Math.max(5, ...strikes.filter((strike) => strike.melee).map((strike) => strike.reach)),
        strikes,
        spells,
        ...builtins,
        size: system.traits.size?.value ?? "med",
        // (I2: with what its items' rules add without a condition — a vampire's physical resistance except magical silver — as the live
        // actor has them; a custom type's or exception's definition kept.)
        resistances: [...(system.attributes.resistances ?? []), ...ruleIwr(npc, "Resistance")].map((entry) => ({ type: entry.type, value: entry.value ?? 0, exceptions: (entry.exceptions ?? []).map(iwrException), ...(entry.definition ? { definition: entry.definition } : {}), ...(entry.doubleVs?.length ? { doubleVs: entry.doubleVs } : {}) })),
        weaknesses: [...(system.attributes.weaknesses ?? []), ...ruleIwr(npc, "Weakness")].map((entry) => ({ type: entry.type, value: entry.value ?? 0, exceptions: (entry.exceptions ?? []).map(iwrException), ...(entry.definition ? { definition: entry.definition } : {}) })),
        immunities: [...(system.attributes.immunities ?? []), ...ruleIwr(npc, "Immunity")].map((entry) => entry.type),
        ...immunityExceptions([...(system.attributes.immunities ?? []), ...ruleIwr(npc, "Immunity")]),
        // (I4: the roll options its predicated Fast Healing names that its rules turn on by default — Mask of Power's, not a scamp's terrain.)
        rollOptions: defaultOptions(npc, [...(builtins.fastHealingWhen ?? []).map((entry) => entry.when), builtins.regeneration?.when]),
        usedAbilities: used
    };
}

// (B298: a summon's creatures as reserves, from the packs — the creature it links or names, the best of its options, the best its pick allows
// in the rulebook bestiaries, or another of itself.)
const SUMMON_PACKS = ["pathfinder-monster-core", "pathfinder-monster-core-2", "pathfinder-npc-core", "pathfinder-bestiary", "pathfinder-bestiary-2", "pathfinder-bestiary-3"];
const packDocs = new Map();
const actorsOf = (pack) => {
    if (!packDocs.has(pack)) {
        let docs = [];
        try {
            docs = readDocuments(`${PACK_ROOT}/${pack}`).filter((doc) => doc.collection === "actors");
        } catch {
            docs = [];
        }
        packDocs.set(pack, docs);
    }
    return packDocs.get(pack);
};
function summonDocument(from) {
    const linked = /^Compendium\.pf2e\.([\w-]+)\.Actor\.(\w+)$/.exec(String(from?.uuid ?? ""));
    if (linked) return actorsOf(linked[1]).find((doc) => doc._id === linked[2]) ?? null;
    if (from?.name) for (const pack of SUMMON_PACKS) {
        const found = actorsOf(pack).find((doc) => doc.type === "npc" && doc.name.toLowerCase() === String(from.name).toLowerCase());
        if (found) return found;
    }
    return null;
}

// The rulebook bestiaries' creatures a summon's pick allows ({ rank, any, all, maxLevel }), as docs — the spell ratings' choice of the best
// of them (2026-10-21).
export function summonCandidates(pick) {
    const maxLevel = Number.isFinite(pick?.maxLevel) ? pick.maxLevel : pick?.rank ? SUMMON_LEVELS[Math.min(10, pick.rank.max ?? pick.rank.base)] : null;
    return SUMMON_PACKS.flatMap((pack) => actorsOf(pack).filter((actor) => actor.type === "npc"
        && (maxLevel === null || Number(actor.system?.details?.level?.value) <= maxLevel)
        && (!pick?.any?.length || pick.any.some((trait) => (actor.system?.traits?.value ?? []).includes(trait)))
        && (!pick?.all?.length || pick.all.every((trait) => (actor.system?.traits?.value ?? []).includes(trait))))
        .map((actor) => ({ pack, doc: actor })));
}

export function summonReserves(maker) {
    const out = [];
    for (const entry of maker.summons ?? []) {
        let creature = entry.creature;
        let doc = null;
        let spec = null;
        if (creature.options) {
            const found = creature.options.map((option) => summonDocument(option.from));
            const index = bestOption(creature.options.map((option, i) => ({ index: i, level: Number(found[i]?.system?.details?.level?.value ?? -2), count: Number(option.count) || 1 })).filter((option) => found[option.index]));
            creature = creature.options[index];
            entry.count = creature.count ?? 1;
            entry.perUse = Math.max(1, Number(creature.count) || 1);
            doc = found[index];
        } else if (creature.pick) {
            const entries = SUMMON_PACKS.flatMap((pack) => actorsOf(pack).map((actor) => ({ uuid: `Compendium.pf2e.${pack}.Actor.${actor._id}`, name: actor.name, level: Number(actor.system?.details?.level?.value), traits: actor.system?.traits?.value ?? [], type: actor.type })));
            const best = bestPick(entries, creature.pick);
            doc = best ? summonDocument({ uuid: best.uuid }) : null;
        } else if (creature.from?.self) spec = structuredClone({ ...maker, summons: undefined });
        else doc = summonDocument(creature.from);
        if (doc && !spec) spec = { ...combatant(doc), id: "summon", side: "foes" };
        if (!spec) continue;
        if (creature.adjust === "elite") spec = eliteAdjust(spec);
        else if (creature.adjust === "weak") spec = weakAdjust(spec);
        for (let index = 0; index < reserveCount(entry); index++) {
            const reserve = asReserve(spec, maker, entry, index);
            entry.reserveIds.push(reserve.id);
            out.push(reserve);
        }
    }
    return out;
}

export { readDocuments };
