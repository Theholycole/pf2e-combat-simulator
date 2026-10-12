// Monster abilities the engine plays as its own rules. The ability module
// compiles them as { builtin } (no plan to resolve): Ferocity, Rend, Sneak
// Attack, Pack Attack, Regeneration, Fast Healing, Draconic Frenzy, Pounce,
// Draconic Momentum, bonuses to saves against magic, and reactions (Nimble
// Dodge, Challenge Fate, Twisting Tail, Death Frenzy).

const SIZES = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
const SIZE_WORDS = { tiny: "tiny", sm: "small", med: "medium", lg: "large", huge: "huge", grg: "gargantuan" };

// A size ("med", "medium", "lg" …) as a number: tiny 0 … gargantuan 5; medium when unknown.
export function sizeRank(size) {
    const index = SIZES.indexOf(SIZE_WORDS[size] ?? size);
    return index < 0 ? 2 : index;
}

// Adds an ability compiled as { builtin } to a combatant spec (the snapshot's
// or a test's). name: the ability's name. Returns false for a builtin the
// engine doesn't play.
export function addBuiltin(spec, plan, name) {
    switch (plan?.builtin) {
        case "ferocity":
            spec.reactions = { ...(spec.reactions ?? {}), ferocity: true };
            // (B95, Ferocity's kin: its Hit Points ("half", a number or a formula), whether it's wounded, its uses, a Strike after, a
            // Mythic Point's cost, a free action's.)
            if (plan.hp !== undefined) {
                spec.ferocityRule = { name, hp: plan.hp, wounded: plan.wounded !== false, ...(Number.isFinite(plan.uses) ? { uses: plan.uses } : {}), ...(plan.strike ? { strike: plan.strike } : {}), ...(plan.mythic ? { mythic: true } : {}), ...(plan.free ? { free: true } : {}) };
                if (plan.mythic) spec.mythicPoints ??= 3;
            }
            return true;
        case "rend":
            spec.rend = { strike: plan.strike ?? null };
            return true;
        case "attack-of-opportunity":
        case "reactive-strike":
            // (B156, Coiled Strike: only in a state the engine doesn't play.)
            if (plan.requires) return false;
            spec.reactions = { ...(spec.reactions ?? {}), aoo: true };
            return true;
        case "shield-block":
            spec.reactions = { ...(spec.reactions ?? {}), shieldBlock: true };
            return true;
        // A rock is one of the creature's Strikes already; Change Shape changes nothing in a fight.
        case "throw-rock":
        case "no-effect":
            return true;
        case "strike-extra":
            spec.strikeExtras = [...(spec.strikeExtras ?? []), ...plan.extras.map((extra) => ({ ...extra, source: name }))];
            return true;
        case "save-bonus":
            spec.saveBonuses = [...(spec.saveBonuses ?? []), ...plan.bonuses];
            return true;
        case "regeneration":
            spec.regeneration = { value: plan.value, deactivatedBy: [...(plan.deactivatedBy ?? [])] };
            return true;
        case "fast-healing":
            spec.fastHealing = Math.max(spec.fastHealing ?? 0, plan.value);
            return true;
        case "multi-strike":
            spec.multiStrikes = [...(spec.multiStrikes ?? []), { name, actions: plan.actions, strikes: [...plan.strikes], ...(plan.sameMap ? { sameMap: true } : {}), ...(plan.sameTarget ? { sameTarget: true } : {}), ...(plan.oncePerTurn ? { oncePerTurn: true } : {}), ...(plan.each ? { each: true } : {}), ...(Number.isFinite(plan.max) ? { max: plan.max } : {}), ...(plan.grab ? { grab: true } : {}), ...(plan.penalty ? { penalty: plan.penalty } : {}), ...(plan.requires ? { requires: plan.requires } : {}), ...(plan.after?.length ? { after: plan.after.map((entry) => ({ ...entry })) } : {}), ...(plan.bothHit ? { bothHit: { conditions: [...(plan.bothHit.conditions ?? [])], damage: [...(plan.bothHit.damage ?? [])], ...(plan.bothHit.follow ? { follow: plan.bothHit.follow } : {}), ...(plan.bothHit.strikeDamage ? { strikeDamage: plan.bothHit.strikeDamage } : {}), ...(plan.bothHit.affliction ? { affliction: plan.bothHit.affliction } : {}) } } : {}), ...(plan.noMap ? { noMap: true } : {}), ...(plan.secondOffGuard ? { secondOffGuard: plan.secondOffGuard } : {}), ...(Number.isFinite(plan.countsAs) ? { countsAs: plan.countsAs } : {}), ...(plan.ifFirstHits ? { ifFirstHits: true } : {}), ...(plan.penalties?.length ? { penalties: [...plan.penalties] } : {}), ...(Number(plan.strides) > 0 ? { strides: Number(plan.strides) } : {}), ...(plan.notGrabbed ? { notGrabbed: true } : {}), ...(plan.noGrab ? { noGrab: true } : {}), ...(plan.flourish ? { flourish: true } : {}), ...(plan.critical ? { critical: { conditions: [...(plan.critical.conditions ?? [])], damage: [...(plan.critical.damage ?? [])] } } : {}), ...(plan.extraDamage?.length ? { extraDamage: [...plan.extraDamage] } : {}), ...(plan.then ? { then: plan.then } : {}), ...(plan.oncePerFight ? { oncePerFight: true } : {}), ...(plan.noMomentum ? { noMomentum: true } : {}) }];
            return true;
        case "charge":
            spec.charges = [...(spec.charges ?? []), { name, actions: plan.actions, strides: plan.strides, strike: plan.strike ?? null, attackBonus: plan.attackBonus ?? 0, damage: plan.damage ?? null, ...(plan.safe ? { safe: true } : {}), ...(plan.fatal ? { fatal: plan.fatal } : {}), ...(plan.deadly ? { deadly: plan.deadly } : {}), ...(plan.halfDamage ? { halfDamage: true } : {}), ...(plan.offGuard ? { offGuard: plan.offGuard === "first" ? "first" : true } : {}), ...(plan.oncePerFight ? { oncePerFight: true } : {}), ...(plan.damageBonus ? { damageBonus: plan.damageBonus } : {}), ...(plan.recharge ? { recharge: plan.recharge } : {}) }];
            return true;
        // (B143: a monster's Glimpse of Redemption or Liberating Step: its resistance; the redeemer's choice played as a champion's.)
        // (Its own: Iron Command's kneel or mental damage, Selfish Shield's resistance, Destructive Vengeance's damage both ways.)
        case "champion-reaction":
            if (!Number.isFinite(plan.resistance) || !["glimpse-of-redemption", "liberating-step", "iron-command", "selfish-shield", "destructive-vengeance"].includes(plan.slug)) return false;
            spec.championReaction = { slug: plan.slug, name, self: !!plan.self, resistance: plan.resistance, dice: Number(plan.dice) || 1, ...(plan.selfDamage ? { selfDamage: plan.selfDamage } : {}), ...(plan.damage ? { damage: plan.damage } : {}) };
            return true;
        // A monster's Retributive Strike (the glossary's): a champion's, the ally's resistance 2 + the monster's level.
        case "retributive-strike":
            if (!Number.isFinite(plan.resistance)) return false;
            spec.championReaction = { slug: "retributive-strike", name, self: false, resistance: plan.resistance, dice: 1 };
            return true;
        // Slow, Weapon Supremacy: a condition it always has; "can't use reactions" (B50).
        case "permanent-condition":
            spec.permanent = [...(spec.permanent ?? []), ...(plan.conditions ?? [])];
            if (plan.noReactions) spec.noReactions = true;
            return true;
        // A rage or frenzy on itself (B64): an effect with its modifiers and temporary Hit Points, extra dice on its melee
        // Strikes; Fanatical Frenzy only once it's hurt.
        // (B196: its resistances too — Reef Armor's, Shifting Form's, Harden Chitin's; Reef Armor's ending with its temporary Hit Points.)
        case "self-effect": {
            // Its extra damage on its melee Strikes (a rage's), or (B69) on the Strikes it names ("her fangs Strikes deal an
            // additional 2d8 sonic damage"), its melee ones, or all of them: "2d8[sonic]", "1d10[persistent,bleed]", "2[acid]",
            // "2d8[precision]", "die" (one more of the Strike's own dice).
            // (The Strikes may come after the abilities: the parts are kept, and resolved again as the fight is prepared.)
            const formulas = plan.damage ?? (plan.extraDice ? [plan.extraDice] : []);
            const strikeParts = formulas.length ? { formulas: [...formulas], strike: plan.strike ?? null, scope: plan.damage ? (plan.melee ? "melee" : "all") : "melee" } : null;
            const strikeDeltas = strikeParts && spec.strikes?.length ? deltasFor(spec.strikes, strikeParts) : null;
            // (A stance lasts until another ends it.)
            const rounds = plan.stance ? Infinity : plan.model?.rounds ?? 10;
            const model = { name, rounds, modifiers: [...(plan.model?.modifiers ?? [])], tempHp: plan.model?.tempHp ?? 0, fastHealing: 0, resistances: (plan.model?.resistances ?? []).map((entry) => ({ type: entry.type, value: Number(entry.value) || 0, exceptions: [...(entry.exceptions ?? [])] })), weaknesses: [], immunities: [], conditions: [], unsupported: [], situational: 0, ...(plan.model?.endsWithTempHp ? { endsWithTempHp: true } : {}), ...(plan.nextStrike ? { nextStrike: true } : {}), ...(strikeParts ? { strikeParts } : {}), ...(strikeDeltas ? { strikeDeltas } : {}), ...(plan.noConcentrate ? { noConcentrate: true } : {}) };
            // (B137, Cower, Entrench: a stance that ends when it moves.)
            spec.selfEffects = [...(spec.selfEffects ?? []), { name, actions: plan.actions ?? 1, model, ...(plan.stance ? { stance: true } : {}), ...(plan.endsOnMove ? { endsOnMove: true } : {}), ...(plan.requires === "after-cast" ? { afterCast: plan.nonCantrip ? "non-cantrip" : true } : {}), ...(plan.requires === "raging" ? { whileRaging: true } : {}), ...(plan.requiresEffect ? { requiresEffect: plan.requiresEffect } : {}), ...(plan.whenHurt ? { whenHurt: true } : {}), ...(plan.trigger ? { trigger: { ...plan.trigger } } : {}) }];
            return true;
        }
        // Golem Antimagic (B56): what others' magic does to it.
        case "golem-antimagic":
            spec.golemAntimagic = { harmed: plan.harmed ?? null, healed: plan.healed ?? null, slowed: plan.slowed ?? null };
            return true;
        // Steady Spellcasting (B55): a flat check against a reaction's disruption.
        case "steady-spellcasting":
            spec.steadySpellcasting = Number(plan.dc) || 15;
            return true;
        case "momentum":
            spec.momentum = { recharges: [...(plan.recharges ?? [])] };
            return true;
        // Reactions: Nimble Dodge and Retract Body, Challenge Fate, Twisting Tail, Death Frenzy.
        case "ac-reaction":
            spec.acReaction = { value: plan.value, when: plan.when, name, ...(plan.against ? { against: plan.against } : {}) };
            return true;
        // (B193, Ray Displacement: a ranged spell attack at it only.)
        case "attack-misfortune":
            spec.misfortuneReaction = { name, ...(plan.spell ? { spell: true } : {}), ...(plan.ranged ? { ranged: true } : {}) };
            return true;
        // Shadow Evade, Scintillating Defense: the attacker's flat check against the hit, a miss on a failure (B41).
        case "conceal-reaction":
            if (!Number.isFinite(plan.dc)) return false;
            spec.concealReaction = { name, dc: plan.dc, ranged: !!plan.ranged };
            return true;
        // Resilient Form, Cushioned Blow: a critical hit on it becomes a normal hit on a flat check (a reaction, or a
        // free action with its uses a day).
        // Wished Away, Withhold Death (B60): resistance to all damage against a critical hit on it.
        case "crit-resistance":
            spec.critResistance = { name, value: Number(plan.value) || 0 };
            return true;
        // Resistance against the damage that sets it off (B99): Liquefy, Chipping Scales; its uses a day a number (once a fight).
        // (B193, Divert Essence: a spell aimed at it, resistance equal to the spell's rank against that spell's damage; its lasting until its
        // next turn against other spells isn't played.)
        case "resist-damage":
            if (plan.value === "rank" && plan.spell) {
                spec.resistReaction = { name, value: "rank", spell: true, on: null, types: null };
                spec.resistUses = Number(plan.uses) || Infinity;
                return true;
            }
            if (!(Number(plan.value) > 0)) return false;
            spec.resistReaction = { name, value: Number(plan.value), on: plan.on ?? null, types: plan.types ?? null, ...(plan.attack ? { attack: true } : {}), ...(plan.foe ? { foe: true } : {}), ...(plan.lasts ? { lasts: plan.lasts } : {}), ...(plan.acPenalty ? { acPenalty: plan.acPenalty } : {}), ...(plan.quickened ? { quickened: plan.quickened } : {}), ...(plan.lashBack ? { lashBack: { bonus: Number(plan.lashBack.bonus) || 0 } } : {}) };
            spec.resistUses = Number(plan.uses) || Infinity;
            return true;
        // A harder Escape from it (B105): Tighten Coils' "The DC of the Escape check is increased by 2", No Liberation's "…a –2
        // circumstance penalty to the check to Escape": its reaction as a creature it holds tries to Escape.
        case "escape-guard":
            if (!(Number(plan.value) > 0)) return false;
            spec.escapeGuard = { name, value: Number(plan.value) };
            return true;
        case "crit-downgrade":
            // (A flat check's DC, or none: B59's Collapse, B86's choice. B59 left this guard asking for a DC, so until 2026-10-11 the
            // ones with no check never loaded.)
            if (plan.dc != null && !Number.isFinite(plan.dc)) return false;
            spec.critDowngrade = { name, dc: plan.dc ?? null, ...(Number.isFinite(plan.uses) ? { uses: plan.uses } : {}), ...(plan.collapse ? { collapse: true } : {}), ...(plan.or ? { or: { ...plan.or } } : {}) };
            return true;
        case "reaction-strike":
            // (B145, Twin Riposte: one that needs a state of its own — "is benefiting from Twin Parry" — isn't played.)
            if (plan.requires) return false;
            spec.reactionStrikes = [...(spec.reactionStrikes ?? []), { name, triggers: [...plan.triggers], strike: plan.strike, penalty: plan.penalty ?? 0, disrupts: plan.disrupts === "critical" ? "critical" : !!plan.disrupts, ...(plan.hinders ? { hinders: plan.hinders } : {}), ...(plan.second ? { second: true } : {}),
                // (B89: the damage types that set it off, a random creature in reach, the trolls' extra flat check against persistent fire.)
                ...(plan.damageTypes?.length ? { damageTypes: [...plan.damageTypes] } : {}), ...(plan.random ? { random: true } : {}), ...(plan.persistentFire ? { persistentFire: true } : {}), ...(plan.fortune ? { fortune: true } : {}),
                // (B111: a basic maneuver in place of the Strike, with its own penalty or bonus.)
                ...(plan.skill ? { skill: plan.skill } : {}), ...(plan.bonus ? { bonus: plan.bonus } : {}),
                // (B121: Retaliatory Strike's extra dice on a hit; Avenging Claws' Step first; Vengeful Throw's ranged Strike from afar.)
                ...(plan.extraDamage ? { extraDamage: plan.extraDamage } : {}), ...(plan.step ? { step: true } : {}), ...(plan.ranged ? { ranged: true } : {}), ...(Number(plan.from) > 0 ? { from: Number(plan.from) } : {}),
                // (B122: Knowing Glance's melee Strikes only; Bodyguard's Reprisal's charge, played as any ally.)
                ...(plan.melee ? { melee: true } : {}), ...(plan.ward ? { ward: true } : {}), ...(plan.persistentType ? { persistentType: plan.persistentType } : {}),
                // (B123: Quick Capture's grab on a hit; Deadly Cleave's same multiple attack penalty.)
                ...(plan.grab ? { grab: true } : {}), ...(plan.sameMap ? { sameMap: true } : {}),
                // (B129: Vengeful Sting's +2 damage on a hit.)
                ...(Number(plan.damageBonus) ? { damageBonus: Number(plan.damageBonus) } : {}),
                // (B207, Repartee Riposte: conditions on a hit, others on a critical hit.)
                ...(plan.onHit?.conditions?.length || plan.onHit?.critical?.length ? { onHit: { conditions: [...(plan.onHit.conditions ?? [])], critical: [...(plan.onHit.critical ?? [])] } } : {}) }];
            return true;
        // Mythic abilities (B72; the user's choice: three Mythic Points a fight): Remove a Condition, Recharge, Undying Myth.
        case "mythic":
            if (!["remove-condition", "recharge", "undying"].includes(plan.kind)) return false;
            spec.mythicPoints ??= 3;
            spec.mythic = { ...(spec.mythic ?? {}), [plan.kind]: { name, actions: Number(plan.actions) || 1, ...(plan.fraction ? { fraction: plan.fraction } : {}), ...(plan.amount ? { amount: plan.amount } : {}), ...(plan.quickened ? { quickened: true } : {}), ...(plan.abilities ? { abilities: true } : {}) } };
            return true;
        // Golden Luck, Word of Wisdom (B80): its own (or an ally's within its distance) failed save one degree better, then not for 1d4
        // rounds; Cat's Luck: its Reflex save rerolled, the better kept, once a fight (its use: a number on the creature).
        // Hammer Block, Stygian Guardian (B94): +AC for an ally within its distance as an attack hits it, when that turns it aside; Wind
        // Shell's only against ranged attacks; Reactive Defense's Strike at the attacker after.
        case "ally-ac-reaction":
            // (B182: itself too, a dragon's shield.)
            spec.allyAcReaction = { name, value: Number(plan.value) || 2, within: plan.within === "reach" ? 10 : Number(plan.within) || 10, ...(plan.ranged ? { ranged: true } : {}), ...(plan.strike ? { strike: plan.strike } : {}), ...(plan.self ? { self: true } : {}) };
            return true;
        case "save-boost":
            if (plan.ally) spec.allySaveBoost = { name, within: plan.within ?? 60, recharge: plan.recharge ?? null };
            else {
                // (B93: once a fight, Stubborn Resolve's; only a critical failure made a failure, Reality Twist's; a free action's.)
                spec.saveBoost = { name, recharge: plan.recharge ?? null, ...(plan.criticalOnly ? { criticalOnly: true } : {}), ...(plan.free ? { free: true } : {}),
                    // (B132, Gardener's Resolve: only a failure, of one save, against effects with its traits; damage on itself.)
                    ...(plan.failureOnly ? { failureOnly: true } : {}), ...(plan.save ? { save: plan.save } : {}), ...(plan.against?.length ? { against: [...plan.against] } : {}), ...(plan.selfDamage ? { selfDamage: plan.selfDamage } : {}),
                    // (B169, Flash of Insight: a success, whatever it rolled.)
                    ...(plan.toSuccess ? { toSuccess: true } : {}) };
                if (Number.isFinite(plan.uses)) spec.saveBoostUses = plan.uses;
            }
            return true;
        // Occult Ward, Orc Superstition (B110): a bonus to its own save as it comes, its reaction.
        case "save-bonus-reaction":
            if (!(Number(plan.value) > 0)) return false;
            // (B125, Stay Strong!, Free Mind: an ally's save, its bonus as it comes.)
            if (plan.ally) {
                spec.allySaveBonus = { name, value: Number(plan.value), within: Number(plan.within) || 60, against: plan.against ?? null, ...(plan.animal ? { animal: true } : {}), ...(plan.upgrade ? { upgrade: true } : {}) };
                return true;
            }
            spec.saveBonusReaction = { name, value: Number(plan.value), against: plan.against ?? null };
            return true;
        // (B183, Word of Advice: an ally's Stride and Strike, its extra damage on a hit.)
        case "ally-advance":
            // (B202, Kingpin's Command: the ally's reaction, each ally once.)
            spec.allyAdvance = { name, actions: Number(plan.actions) || 1, within: Number(plan.within) || 60, extraDamage: [...(plan.extraDamage ?? [])], ...(plan.oncePerTurn ? { oncePerTurn: true } : {}), ...(plan.reaction ? { reaction: true } : {}), ...(plan.oncePerAlly ? { oncePerAlly: true } : {}) };
            return true;
        // (B171, Sidestep, Glide Aside: a Strike that misses it sent at another creature beside it.)
        case "redirect-attack":
            // (B191, Hop-Dodge: as a melee Strike is made at it, not after a miss.)
            spec.redirectAttack = { name, ...(plan.step ? { step: true } : {}), ...(plan.when === "targeted" ? { when: "targeted" } : {}) };
            return true;
        // (B170, Guide's Warning, Warning Hoot: a circumstance bonus to its allies' initiative rolls; its reaction, or a free action.)
        case "initiative-warning":
            if (!(Number(plan.value) > 0)) return false;
            // (B178, Warning Ears: only its allies within 10 feet.)
            spec.initiativeWarning = { name, value: Number(plan.value), ...(plan.free ? { free: true } : {}), ...(Number(plan.within) > 0 ? { within: Number(plan.within) } : {}) };
            return true;
        // (B168, Drowning Drone: a skill check as a save is attempted, the higher of the two resolving the effect — its own, or its allies'
        // within its distance (of its trait); that kind of save, against those traits.)
        case "save-skill":
            if (!plan.skill) return false;
            spec.saveSkill = { name, skill: plan.skill, save: plan.save ?? null, against: plan.against ?? null, ally: !!plan.ally, within: Number(plan.within) || 0, allyTrait: plan.allyTrait ?? null };
            return true;
        case "save-reroll":
            // (B125, Hold Fast, Distracting Frolic, Guide to Fortune: an ally's failed save rerolled, keeping the better; its own too where
            // it says so.)
            if (plan.ally) {
                // (B181: the new result kept, a critical failure on it a failure.)
                spec.allySaveReroll = { name, within: Number(plan.within) || 60, save: plan.save ?? null, against: plan.against ?? null, uses: Number(plan.uses) || Infinity, ...(plan.self ? { self: true } : {}), ...(plan.floor ? { floor: plan.floor } : {}) };
                return true;
            }
            // (B93: Halfling Luck's "must use the new result", keep "new"; a free action's.)
            spec.saveReroll = { name, save: plan.save ?? null, ...(plan.keep ? { keep: plan.keep } : {}), ...(plan.free ? { free: true } : {}), ...(plan.mythic ? { mythic: true } : {}) };
            // (B108, Reroll: a Mythic Point each time, as many as it has.)
            spec.saveRerollUses = plan.mythic ? Infinity : 1;
            if (plan.mythic) spec.mythicPoints ??= 3;
            return true;
        // Shake It Off, Slough Skin (B77; the user's choice): the first harmful condition an enemy gives it, negated with its reaction once a
        // fight (Dogged Persistence: only the conditions it names). Its use left: a number on the creature.
        case "negate-condition":
            spec.negateCondition = { name, ...(plan.conditions?.length ? { conditions: [...plan.conditions] } : {}) };
            spec.negateConditionUses = 1;
            return true;
        // Quickened Casting (B72): its next spell (of that rank or lower) one action fewer, once a fight.
        case "quickened-casting":
            spec.quickenedCasting = { name, maxRank: Number.isFinite(plan.maxRank) ? plan.maxRank : null };
            return true;
        // A monster's Spellstrike (B72): the magus's (C20).
        case "spellstrike":
            spec.spellstrike = { name };
            return true;
        // Speed Surge (B72): two moves for one action, three times a fight.
        case "speed-surge":
            // (B101: no daily count — once a round, or a recharge.)
            spec.speedSurge = { name, uses: plan.uses == null && (plan.oncePerRound || plan.recharge) ? Infinity : Number(plan.uses) || 3, ...(plan.recharge ? { recharge: plan.recharge } : {}) };
            return true;
        // Poison Weapon (B72): its poison on the next weapon Strike that hits and deals damage.
        case "poison-weapon":
            if (!plan.poison?.plan?.resolution) return false;
            spec.poisonWeapon = { name, actions: Number(plan.actions) || 1, doses: Number(plan.doses) || 1, spell: { name: plan.poison.name, plan: plan.poison.plan, castRank: 1, dc: null, attack: null, pool: null, kind: "ability" } };
            return true;
        // (B167, Tactical Direction: Attack of Opportunity for its allies of a trait within an emanation, until the end of their next turn.)
        case "grant-aoo":
            // (B176, Call to Arms: until its own next turn ends, and an ally that uses it immune to it after.)
            spec.grantAoo = { name, actions: Number(plan.actions) || 1, within: Number(plan.within) || 30, ...(plan.trait ? { trait: plan.trait } : {}), ...(plan.until === "source" ? { untilSource: true } : {}), ...(plan.usedOnce ? { usedOnce: true } : {}) };
            return true;
        // A monster's Hunt Prey (B71): a ranger's precision edge, its dice ("1d8 precision damage" the first hit on its prey each round).
        case "hunt-prey":
            // (B164, Mark for Death: deadly on its Strikes (or the ones it names) against its mark.)
            if (plan.edge === "deadly" && Number(plan.die) > 0) {
                spec.huntPrey = { edge: "deadly", die: Number(plan.die), ...(plan.strike ? { strike: plan.strike } : {}) };
                return true;
            }
            if (plan.edge !== "precision") return false;
            // (B153, Lawbringer: every Strike against the creature it marks, not only the first hit each round.)
            spec.huntPrey = { edge: "precision", precisionDice: Number(plan.dice) || 1, die: Number(plan.die) || 8, ...(plan.every ? { every: true } : {}) };
            return true;
        // Swift Leap, Jet (B70): a move that doesn't trigger reactions, out of a Melee.
        case "safe-move":
            // (B87: a teleport's recharge, Jaunt's "can't use Jaunt again for 1d4 rounds".)
            spec.safeMove = { name, actions: Number(plan.actions) || 1, ...(plan.recharge ? { recharge: plan.recharge } : {}) };
            return true;
        // Skitter, Skittish, Scurry, Flit Back (B116): a reaction that moves it off as a foe misses, hits or damages it, or comes beside it.
        case "withdraw":
            if (!["missed", "hit", "damaged", "attacked", "approach"].includes(plan.on)) return false;
            spec.withdraw = { name, on: plan.on, melee: !!plan.melee, foe: plan.foe ?? null, safe: !!plan.safe, ...(plan.recharge ? { recharge: plan.recharge } : {}) };
            return true;
        // No Escape, Reactive Pursuit (B117): a foe in its reach moving away, followed (the hunted prey's only; a Strike after).
        case "follow":
            spec.follow = { name, prey: !!plan.prey, strike: !!plan.strike };
            return true;
        // Hellish Revenge, Spitting Rage (B118): a critical hit on it recharges its breath, used at once.
        case "crit-recharge":
            if (!plan.recharges) return false;
            spec.critRecharge = { name, recharges: plan.recharges, untilNatural: !!plan.untilNatural };
            return true;
        // Flash of Brutality (B118): once a day, its hit a critical one (again after its Ferocity, where it says so).
        case "crit-upgrade":
            spec.critUpgrade = { name, uses: Number(plan.perDay) || 1, ferocityRecharges: !!plan.ferocityRecharges };
            return true;
        // Human Shield, Mortal Shield, Interposition (B124): an ally's damage, taken in its place (all of it or half).
        case "intercept":
            spec.intercept = { name, ward: plan.ward ?? "ally", share: Number(plan.share) || 1, ...(plan.strikes ? { strikes: true } : {}), ...(plan.attacks ? { attacks: true } : {}), ...(Number(plan.within) > 0 ? { within: Number(plan.within) } : {}) };
            return true;
        // You Don't Have My Permission to Die!, Soul Anchor, Recall the Fallen (B124): an ally kept from dropping.
        // (B195, Reawaken!: a creature it sees that dies, back at half its Hit Points, each once; returned at 0 HP, dying or stable, isn't played.)
        case "rescue":
            if (plan.hp === 0) return false;
            spec.rescue = { name, within: plan.sees ? Infinity : Number(plan.within) || 30, ...(plan.heal ? { heal: plan.heal } : plan.hp === "half" ? { hp: "half" } : { hp: 1 }), ...(plan.onDeath ? { onDeath: true } : {}), ...(plan.doomed ? { doomed: Number(plan.doomed) } : {}), ...(plan.living ? { living: true } : {}), ...(plan.perDay ? { uses: 1 } : {}), ...(plan.oncePerTarget ? { oncePerTarget: true } : {}) };
            return true;
        // (B195, Siphon Life: a foe's healing spell near it at its least — dice at their minimum, flat values halved — and temporary Hit Points.)
        case "heal-siphon":
            spec.healSiphon = { name, within: Number(plan.within) || 60, ...(plan.tempHp ? { tempHp: String(plan.tempHp) } : {}) };
            return true;
        // Fast Swallow (B70): Swallow Whole as a reaction when it grabs a creature.
        case "fast-swallow":
            spec.fastSwallow = { name };
            return true;
        case "death-strike":
            spec.deathStrike = { name, strike: plan.strike ?? null };
            return true;
        // Knocking Sweep (B75): a basic action (Trip) at each creature in its reach, separate checks, at one multiple attack penalty.
        case "skill-sweep":
            spec.skillSweeps = [...(spec.skillSweeps ?? []), { name, actions: plan.actions ?? 2, action: plan.action, ...(plan.sameMap ? { sameMap: true } : {}), ...(plan.oncePerTurn ? { oncePerTurn: true } : {}) }];
            return true;
        // Wrestle, Intimidating Strike, Rhinoceros Charge: a Strike (after Strides) with more on a hit.
        case "strike-activity":
            spec.strikeActivities = [...(spec.strikeActivities ?? []), {
                name,
                actions: plan.actions,
                strides: plan.strides,
                strike: plan.strike ?? null,
                attackBonus: plan.attackBonus ?? 0,
                damageBonus: plan.damageBonus ?? 0,
                damage: plan.damage ?? null,
                offGuard: !!plan.offGuard,
                requires: plan.requires ?? null,
                ...(plan.nonCantrip ? { nonCantrip: true } : {}),
                oncePerFight: !!plan.oncePerFight,
                ...(plan.countsAs > 1 ? { countsAs: plan.countsAs } : {}),
                ...(plan.noMap ? { noMap: true } : {}),
                ...(plan.oncePerTurn ? { oncePerTurn: true } : {}),
                ...(plan.extraWeaponDice ? { extraWeaponDice: plan.extraWeaponDice } : {}),
                // A follow-up's Strike (B68): only straight after a Strike that fits; previousMap, at that Strike's penalty.
                ...(plan.after ? { after: { ...plan.after } } : {}),
                ...(plan.previousMap ? { previousMap: true } : {}),
                ...(plan.fatal ? { fatal: plan.fatal } : {}),
                ...(plan.deadly ? { deadly: plan.deadly } : {}),
                ...(plan.halfDamage ? { halfDamage: true } : {}),
                // (B153, Draining Touch, Pinning Shot: "deals no damage on a hit".)
                ...(plan.noDamage ? { noDamage: true } : {}),
                // (B156, Battering Blow: a basic action at the creature after the Strike, hit or miss; Flog Mercilessly: its damage rolled three times.)
                ...(plan.afterStrike ? { afterStrike: plan.afterStrike } : {}),
                ...(plan.damageTimes > 1 ? { damageTimes: Number(plan.damageTimes) } : {}),
                // Bully's Bludgeon (B88): "This attack is nonlethal."
                ...(plan.nonlethal ? { nonlethal: true } : {}),
                // Focused Assault (B74): a failure (not a critical one) still deals the Strike's damage.
                ...(plan.failureDamage ? { failureDamage: true } : {}),
                // (B126, Flay: "against an animal or humanoid" — only at those.)
                ...(plan.targetTraits?.length ? { targetTraits: [...plan.targetTraits] } : {}),
                // (B139: what it does to itself after the Strike — Punishing Strike's Off-Guard, Defensive Slam's +2 AC — until its next turn.)
                ...(plan.selfAfter?.length ? { selfAfter: plan.selfAfter.map((entry) => ({ ...entry })) } : {}),
                // (B199, Uncanny Pounce: as it rolls initiative only.)
                ...(plan.initiative ? { initiative: true } : {}),
                onHit: plan.onHit,
                riderSpell: plan.onHit?.save ? { name, plan: plan.onHit.save, castRank: 1, pool: null, kind: "ability" } : null
            }];
            return true;
        default:
            return false;
    }
}

// Whether its last action was casting a spell (B147: Residual Force's "most recent action was to cast a spell", Primal Weapon's "a non-cantrip
// spell").
export function castJustNow(state, c, nonCantrip = false) {
    const last = c.lastCast;
    return Boolean(last) && last.round === state.round && last.action === (c.actionCount ?? 0) - 1 && (!nonCantrip || !last.cantrip);
}

// Whether the creature's last action was a Strike a follow-up needs (B68): after { strike, melee, on } against its last Strike
// this turn (its name, melee or not, its degree), as its action just before.
const DEGREES = ["criticalFailure", "failure", "success", "criticalSuccess"];
export function followsStrike(state, c, after) {
    const last = c.lastStrike;
    if (!last || last.round !== state.round || last.action !== (c.actionCount ?? 0) - 1) return false;
    if (!(after.on ?? ["success", "criticalSuccess"]).includes(DEGREES[last.degree])) return false;
    if (after.melee && !last.melee) return false;
    if (!after.strike) return true;
    const name = String(last.strike ?? "").toLowerCase();
    return name === after.strike || name.startsWith(after.strike) || after.strike.startsWith(name) || name.includes(after.strike);
}

// A self-effect's extra damage on the creature's Strikes (B69), as strikeDeltas by Strike name: parts { formulas, strike, scope }
// (scope "melee" or "all" when it names no Strike). Formulas: "2d8[sonic]", "1d10[persistent,bleed]", "2[acid]",
// "2d8[precision]", "die" (one more of the Strike's own dice).
export function deltasFor(strikes, parts) {
    const named = parts.strike ? strikeNamed({ strikes }, parts.strike) : -1;
    const chosen = strikes.filter((strike, index) => (parts.strike ? index === named : parts.scope === "all" || strike.melee));
    const partOf = (formula, strike) => {
        if (formula === "die") return { dice: 1, die: strike.damage?.[0]?.die ?? 6, bonus: 0, multiplier: 1, type: strike.damage?.[0]?.type, precision: false, persistent: false };
        const match = /^\(?(?:(\d+)d(\d+))?\+?(\d+)?\)?\[([\w,]+)\]$/.exec(String(formula).replace(/\s+/g, ""));
        if (!match || (!match[1] && !match[3])) return null;
        const kinds = match[4].split(",");
        const type = kinds.find((kind) => !["persistent", "precision"].includes(kind));
        return { dice: Number(match[1] ?? 0), die: Number(match[2] ?? 0), bonus: Number(match[3] ?? 0), multiplier: 1, type: type && type !== "untyped" ? type : strike.damage?.[0]?.type, precision: kinds.includes("precision"), persistent: kinds.includes("persistent") };
    };
    return Object.fromEntries(chosen.map((strike) => [strike.name, parts.formulas.map((formula) => partOf(formula, strike)).filter(Boolean)]));
}

// The index of the creature's Strike a text names ("claw" for "Claw", "fangs" for "Fangs").
export function strikeNamed(c, name) {
    if (!name) return -1;
    const wanted = name.toLowerCase();
    const strikes = c.strikes ?? [];
    // (B122, Shoot First's "firearm Strike": its first firearm.)
    if (wanted === "firearm" && !strikes.some((strike) => strike.name.toLowerCase().includes("firearm"))) return strikes.findIndex((strike) => strike.firearm);
    // (B115: "makes a ranged Strike" — its ranged Strike, the first it has.)
    if (wanted === "ranged" && !strikes.some((strike) => strike.name.toLowerCase().includes("ranged"))) return strikes.findIndex((strike) => !strike.melee);
    let index = strikes.findIndex((strike) => strike.name.toLowerCase() === wanted);
    if (index < 0) index = strikes.findIndex((strike) => strike.name.toLowerCase().startsWith(wanted) || wanted.startsWith(strike.name.toLowerCase()));
    if (index < 0) index = strikes.findIndex((strike) => strike.name.toLowerCase().includes(wanted));
    return index;
}

// The Strikes of a multi-Strike ability (Draconic Frenzy), as indices, in the
// order that loses least to the multiple attack penalty (agile ones last).
// null when one of them isn't among the creature's Strikes.
// The basic action a skill sweep uses (B75): its index in the creature's spells, or -1.
export function sweepActionIndex(c, sweep) {
    return (c.spells ?? []).findIndex((spell) => spell.kind === "basic" && (spell.plan?.source?.slug === sweep.action || String(spell.name ?? "").toLowerCase() === sweep.action));
}

// Raging (B155): a rage on itself that keeps it from concentrating — the planner's own test.
// (B167: the allies Tactical Direction reaches — its trait, near it (not "far"), active, without Attack of Opportunity of their own.)
export function grantAooAllies(state, c) {
    return state.list.filter((ally) => ally !== c && ally.side === c.side && ally.status === "active" && !ally.reactions?.aoo && ally.band !== "far" && (!c.grantAoo?.trait || (ally.traits ?? []).includes(c.grantAoo.trait)) && !c.grantAooImmune?.has(ally.id));
}

export const isRaging = (c) => (c.activeBuffs ?? []).some((buff) => buff.noConcentrate) || (c.effects ?? []).some((effect) => effect.model?.noConcentrate);

export function multiStrikeOrder(c, ability) {
    // A Strike with no name ("makes two unarmed Strikes"): its best melee Strike.
    // (B153: "two ranged Strikes" — its best ranged Strike.)
    const best = (melee = true) => (c.strikes ?? []).reduce((found, strike, index) => (!strike.melee === !melee && (found < 0 || strike.bonus > c.strikes[found].bonus) ? index : found), -1);
    const indices = ability.strikes.map((name) => (name === "ranged" ? best(false) : name ? strikeNamed(c, name) : best()));
    if (indices.some((index) => index < 0)) return null;
    return indices.sort((a, b) => (c.strikes[a].agile ? 1 : 0) - (c.strikes[b].agile ? 1 : 0));
}

// The Strike a charge or Strike activity makes: its bonus to the attack roll
// (for moving 20 feet, or against a target off-guard to it), its bigger damage
// ("the Strike's damage is increased to 3d10+20"), or a bonus to damage.
// Cover Fire: a creature ducks (+2 AC against the shot, then −2 to its own ranged
// attacks) unless its best attack is ranged, when the penalty would cost it more.
export function ducksFromCoverFire(target) {
    const average = (strike) => (strike.damage ?? []).reduce((sum, part) => sum + (part.dice ?? 0) * ((part.die ?? 0) + 1) / 2 + (part.bonus ?? 0), 0) + (strike.bonus ?? 0) / 2;
    const best = [...(target.strikes ?? [])].sort((a, b) => average(b) - average(a))[0];
    return !best || best.melee;
}

// A charge as it's used on that target (B98): "The target is Off-Guard against this Strike unless it has seen a Rearward Rush before".
export function chargeOn(c, charge, targetId) {
    return charge.offGuard === "first" ? { ...charge, offGuard: !c.chargeSeen?.get(charge.name)?.has(targetId) } : charge;
}

// (B98: offGuard "first" — off-guard only to a creature that hasn't seen it before — is settled by its caller as true or false.)
// A multi-Strike's Strike with the extra damage its text gives each (B152, Hellfire Flurry's "These attacks deal an extra 1d4 fire damage").
export function withExtraDamage(strike, formulas) {
    if (!strike || !formulas?.length) return strike;
    const parts = formulas.map((formula) => /^(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?\[([a-z]+)\]$/.exec(String(formula).trim())).filter(Boolean)
        .map((dice) => ({ dice: Number(dice[1]), die: Number(dice[2]), bonus: (dice[3] === "-" ? -1 : 1) * Number(dice[4] ?? 0), multiplier: 1, type: dice[5], persistent: false, precision: false }));
    return parts.length ? { ...strike, damage: [...strike.damage, ...parts] } : strike;
}

export function chargeStrike(strike, charge) {
    const attackBonus = (charge.attackBonus ?? 0) + (charge.offGuard === true ? 2 : 0);
    if (!attackBonus && !charge.damage && !charge.damageBonus && !charge.extraWeaponDice && !charge.finisher && !charge.fatal && !charge.deadly && !charge.halfDamage && !charge.nonlethal && !charge.noDamage && !(charge.damageTimes > 1)) return strike;
    const changed = { ...strike, name: `${strike.name} (${charge.name})`, bonus: strike.bonus + attackBonus, ...(charge.finisher ? { finisher: charge.finisher } : {}), ...(charge.nonlethal ? { nonlethal: true } : {}) };
    if (charge.damageBonus) changed.damage = strike.damage.map((part, index) => (index === 0 ? { ...part, bonus: (part.bonus ?? 0) + charge.damageBonus } : part));
    // Vicious Swing: extra dice of the weapon's own damage (PF2e's critical formula would leave them out).
    if (charge.extraWeaponDice) {
        changed.damage = changed.damage.map((part, index) => (index === 0 ? { ...part, dice: (part.dice ?? 0) + charge.extraWeaponDice } : part));
        delete changed.critDamage;
    }
    const dice = charge.damage ? /(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/.exec(charge.damage) : null;
    if (dice) {
        const type = /\[([a-z]+)\]/.exec(charge.damage)?.[1] ?? strike.damage[0]?.type ?? "untyped";
        changed.damage = [{ dice: Number(dice[1]), die: Number(dice[2]), bonus: (dice[3] === "-" ? -1 : 1) * Number(dice[4] ?? 0), multiplier: 1, type, persistent: false, precision: false }, ...strike.damage.slice(1)];
    }
    // (B69: "This Strike gains the fatal d12 trait", "the deadly d4 trait for this attack"; "The Strike deals half damage".)
    if (charge.fatal) changed.fatal = charge.fatal;
    if (charge.deadly) changed.deadly = { dice: 1, die: charge.deadly };
    if (charge.halfDamage) changed.damage = (changed.damage ?? strike.damage).map((part) => ({ ...part, multiplier: (part.multiplier ?? 1) * 0.5 }));
    // (B156: "rolls damage three times" — that many times its damage, combined.)
    if (charge.damageTimes > 1) changed.damage = (changed.damage ?? strike.damage).map((part) => ({ ...part, multiplier: (part.multiplier ?? 1) * charge.damageTimes }));
    // (B153: "deals no damage on a hit" — none, its riders only.)
    if (charge.noDamage) {
        changed.noDamage = true;
        changed.damage = (changed.damage ?? strike.damage).map((part) => ({ ...part, multiplier: 0 }));
        delete changed.critDamage;
        delete changed.deadly;
        delete changed.fatal;
    }
    return changed;
}

// Roll options of a spell or ability, for predicates such as "item:magical" or "item:trait:mental".
const TRADITIONS = new Set(["arcane", "divine", "occult", "primal"]);

export function sourceOptions(spell) {
    const traits = [...(spell?.plan?.traits ?? []), ...(spell?.tradition ? [spell.tradition] : [])];
    const options = new Set();
    for (const trait of traits) {
        options.add(trait);
        options.add(`item:trait:${trait}`);
    }
    // Spells are magical; an ability is when it has the magical trait or a tradition's.
    const ability = spell?.kind === "ability" || spell?.kind === "basic";
    if (!ability || traits.some((trait) => trait === "magical" || TRADITIONS.has(trait))) {
        options.add("magical");
        options.add("item:magical");
    }
    return options;
}

// PF2e's predicate syntax: an array (all), { or }, { and }, { not }, or a roll option.
export function testPredicate(predicate, options) {
    if (Array.isArray(predicate)) return predicate.every((term) => testPredicate(term, options));
    if (typeof predicate === "string") return options.has(predicate);
    if (predicate?.or) return predicate.or.some((term) => testPredicate(term, options));
    if (predicate?.and) return predicate.and.every((term) => testPredicate(term, options));
    if (predicate?.not !== undefined) return !testPredicate(predicate.not, options);
    return false;
}

// A creature's bonus to one save against a spell or ability (+1 status to all saves vs. magic):
// the highest of each bonus type, summed.
export function saveBonusAgainst(c, save, spell) {
    if (!c.saveBonuses?.length || !spell) return 0;
    const options = sourceOptions(spell);
    const best = new Map();
    let untyped = 0;
    for (const bonus of c.saveBonuses) {
        if (!bonus.saves.includes(save) || !testPredicate(bonus.predicate, options)) continue;
        if (bonus.type === "untyped") untyped += bonus.value;
        else best.set(bonus.type, Math.max(best.get(bonus.type) ?? 0, bonus.value));
    }
    return untyped + [...best.values()].reduce((sum, value) => sum + value, 0);
}

export function isUndead(c) {
    return (c.traits ?? []).includes("undead") || !!c.voidHealing;
}

// Whether an extra-damage ability applies to this hit. offGuard: the target is
// off-guard to the attack; packAllies: the attacker's allies within reach of the target.
export function extraApplies(extra, target, { offGuard, packAllies }) {
    switch (extra.when) {
        case "off-guard":
            return offGuard;
        case "pack":
            return packAllies >= 2;
        case "living":
            return !isUndead(target) && !(target.traits ?? []).includes("construct");
        case "undead":
            return isUndead(target);
        case "frightened":
            return (target.cond?.frightened ?? 0) > 0;
        default:
            return false;
    }
}

// Regeneration works unless damage of a listed type turned it off.
export function regenerating(c) {
    return !!c.regeneration && !c.regenerationOff;
}

// PF2e's standard DC for a level (level −1 to 25).
const LEVEL_DCS = [13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];
export function levelDC(level) {
    return LEVEL_DCS[Math.max(0, Math.min(LEVEL_DCS.length - 1, (level ?? 0) + 1))];
}

// Whether a creature can use a reaction now (confused creatures can't).
export function canReact(c) {
    return c.status === "active" && !c.reactionUsed && !c.noReactions && !c.cond.confused && !c.cond.unconscious && !c.cond.paralyzed && !c.cond.asleep && c.acts !== false;
}
