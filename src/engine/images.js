// Mirror Image (2026-10-21, the user: "have the simulator model mirror image"; the core's image-decoys family): illusory images in the
// caster's space take attacks meant for it. PF2e's text:
//   "Any attack that would hit you has a random chance of hitting one of your images instead of you. If all three images remain, there
//   is a 1 in 4 chance of hitting you (1 on 1d4). With two images remaining, there is a 1 in 3 chance of hitting you (1-2 on 1d6). With
//   only one image, the chances are 1 in 2 (1-3 on 1d6)."
//   "Once an image is hit, it is destroyed. If an attack roll fails to hit your AC but doesn't critically fail, it destroys an image but
//   has no additional effect (even if the attack would normally have an effect on a failure). If an attack roll is a critical success
//   and would hit one of the images, one of the images is destroyed and the attack roll becomes a success against you. Once all the
//   images are destroyed, the spell ends."
// An attack: an attack roll against its AC (a Strike, a spell attack). The spell is visual: an attacker that can't see the images
// (blinded, or in darkness it can't see in) isn't fooled. Chromatic Image: each image a foe destroys is a color — its die picks the row,
// whose damage (and condition) the attacker takes.
// c.images = { spell, count, chances: { <count>: { die, max } }, untilRound, colors }.
import { CRITICAL_FAILURE, CRITICAL_SUCCESS, FAILURE, SUCCESS, degreeDistribution } from "./checks.js";
import { armorClass, isActive, statusPenalty, effectBonus, strikeUsable, targetingChance } from "./combatant.js";
import { unseen } from "./environment.js";
import { log } from "./log.js";

export function applyImages(state, caster, spell, decoys) {
    const rounds = Number(decoys.durationSeconds) > 0 ? Math.max(1, Math.round(Number(decoys.durationSeconds) / 6)) : 10;
    caster.images = { spell: spell.name, count: Number(decoys.images) || 3, chances: decoys.chances ?? {}, untilRound: state.round + rounds, colors: decoys.colors ?? null };
    log(state, `  ${caster.name} has ${caster.images.count} images (${spell.name})`);
}

function imagesOn(state, c) {
    const images = c?.images;
    if (!images) return null;
    if (state && state.round >= images.untilRound) {
        c.images = null;
        return null;
    }
    return images;
}

// Whether this attacker's attack can go to an image: the target has images, and the attacker sees them.
function fooled(state, attacker, target) {
    return Boolean(imagesOn(state, target)) && attacker !== target && !attacker?.cond?.blinded && !(state && unseen(state, attacker, target));
}

// The chance an attack that would hit finds the creature itself (1 without images to fool the attacker).
export function imageShare(state, attacker, target) {
    if (!fooled(state, attacker, target)) return 1;
    const chance = target.images.chances[target.images.count];
    return chance?.die > 0 ? Math.min(1, chance.max / chance.die) : 1;
}

// The same for images it doesn't have yet (Mirror Image about to be cast): all of them.
export function imageShareWith(state, attacker, target, decoys) {
    if (attacker === target || attacker?.cond?.blinded || (state && unseen(state, attacker, target))) return 1;
    const chance = decoys?.chances?.[decoys.images];
    return chance?.die > 0 ? Math.min(1, chance.max / chance.die) : 1;
}

// A degree distribution [critical failure, failure, success, critical success] against the creature with the images counted: a failure,
// and a hit on an image, do nothing (with the critical failures); a critical hit on an image is a hit.
export function imageOdds(odds, you) {
    if (you >= 1) return odds;
    return [odds[CRITICAL_FAILURE] + odds[FAILURE] + odds[SUCCESS] * (1 - you), 0, odds[SUCCESS] * you + odds[CRITICAL_SUCCESS] * (1 - you), odds[CRITICAL_SUCCESS] * you];
}

// An attack roll's degree against a creature with images: { degree, image } — degree what it does to the creature, image true when an
// image took it (a failure that destroyed one, or a hit on one: no effect at all). null: no images to fool this attacker, or a critical
// failure (it passes them by).
export function imageTakes(state, attacker, target, degree, { applyDamage, applyCondition } = {}) {
    if (degree === CRITICAL_FAILURE || !fooled(state, attacker, target)) return null;
    const images = target.images;
    if (degree === FAILURE) {
        destroyImage(state, attacker, target, images, { applyDamage, applyCondition });
        return { degree: FAILURE, image: true };
    }
    const chance = images.chances[images.count];
    const face = chance?.die > 0 ? state.rng.die(chance.die) : 1;
    if (!chance || face <= chance.max) {
        log(state, `  ${attacker.name} rolls ${face} on 1d${chance?.die ?? 1} against ${target.name}'s images: it finds ${target.name}`);
        return null;
    }
    log(state, `  ${attacker.name} rolls ${face} on 1d${chance.die} against ${target.name}'s images: it ${degree === CRITICAL_SUCCESS ? "critically " : ""}hits an image`);
    destroyImage(state, attacker, target, images, { applyDamage, applyCondition });
    return degree === CRITICAL_SUCCESS ? { degree: SUCCESS, image: false } : { degree: FAILURE, image: true };
}

function destroyImage(state, attacker, target, images, { applyDamage, applyCondition }) {
    images.count--;
    log(state, `  an image of ${target.name} is destroyed (${images.count} left)`);
    // (Chromatic Image: "whenever a foe destroys one of the images, roll 1d4 to see which color the image was … The attacker takes the
    // corresponding effect.")
    const colors = images.colors;
    if (colors?.rows?.length && attacker.side !== target.side && isActive(attacker)) {
        const face = state.rng.die(colors.die);
        const row = colors.rows.find((entry) => entry.face === face) ?? colors.rows[0];
        const instances = (row.damage ?? []).map((part) => /^(\d+)\[([a-z-]+)\]$/.exec(part)).filter(Boolean).map((match) => ({ type: match[2], amount: Number(match[1]), persistent: false, precision: false }));
        log(state, `  the image was ${row.label.toLowerCase()}`);
        if (instances.length && applyDamage) {
            const dealt = applyDamage(state, attacker, instances, { source: target });
            log(state, `  ${attacker.name} takes ${dealt} (${images.spell})`);
        }
        if (row.condition?.slug && applyCondition && isActive(attacker)) applyCondition(state, attacker, row.condition.slug, row.condition.value ?? null, null, target);
    }
    if (images.count <= 0) {
        target.images = null;
        log(state, `  ${images.spell} on ${target.name} ends`);
    }
}

// What images are worth to the creature they'd go on, as a share of its Hit Points: the damage they'd turn aside from the foes'
// Strikes over up to three rounds of attacks on it. Each count of images is spent by a failure or a hit on an image; an attack that
// finds the creature (or critically fails) leaves it, so each lasts 1 / (its chance of being spent) attacks, turning aside its share of
// the hits meanwhile.
export function imagesWorth(state, target, decoys, { expectedHitDamage }) {
    const images = Number(decoys?.images) || 0;
    const have = imagesOn(state, target)?.count ?? 0;
    if (!images || have >= images || !(target?.hp?.max > 0)) return 0;
    const foes = state.list.filter((other) => other.side !== target.side && other.status === "active" && !other.cond?.blinded);
    let odds = [0, 0, 0, 0];
    let hit = 0;
    let crit = 0;
    let counted = 0;
    const ac = armorClass(target);
    for (const foe of foes) {
        let best = null;
        for (const strike of foe.strikes ?? []) {
            if (!strikeUsable(foe, strike)) continue;
            const dist = degreeDistribution(strike.bonus - statusPenalty(foe, strike.melee ? "melee" : "ranged") + effectBonus(foe, "attack"), ac);
            const damage = [expectedHitDamage(foe, strike, target, false), expectedHitDamage(foe, strike, target, true)];
            const expected = dist[SUCCESS] * damage[0] + dist[CRITICAL_SUCCESS] * damage[1];
            if (!best || expected > best.expected) best = { dist, damage, expected };
        }
        if (!best) continue;
        odds = odds.map((value, index) => value + best.dist[index] * targetingChance(foe));
        hit += best.damage[0];
        crit += best.damage[1];
        counted++;
    }
    if (!counted) return 0;
    odds = odds.map((value) => value / counted);
    hit /= counted;
    crit /= counted;
    let prevented = 0;
    let attacksToStrip = 0;
    for (let count = images; count > have; count--) {
        const chance = decoys.chances?.[count];
        if (!(chance?.die > 0)) continue;
        const away = 1 - Math.min(1, chance.max / chance.die);
        const spent = odds[FAILURE] + away * (odds[SUCCESS] + odds[CRITICAL_SUCCESS]);
        if (!(spent > 0)) continue;
        prevented += (away * (odds[SUCCESS] * hit + odds[CRITICAL_SUCCESS] * (crit - hit))) / spent;
        attacksToStrip += 1 / spent;
    }
    // The attacks it can expect: about two from each foe a round, their attention shared over its side.
    const side = state.list.filter((other) => other.side === target.side && isActive(other)).length;
    const rounds = Math.min(3, Number(decoys.durationSeconds) > 0 ? Math.round(Number(decoys.durationSeconds) / 6) : 3);
    const attacks = (2 * counted * rounds) / Math.max(1, side);
    return (prevented * Math.min(1, attacks / Math.max(1, attacksToStrip))) / target.hp.max;
}
