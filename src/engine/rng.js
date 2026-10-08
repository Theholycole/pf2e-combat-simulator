// Seeded random numbers. Every run of a batch gets its own stream so a single
// run can be replayed exactly and compare variants share their dice.

function splitmix32(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x9e3779b9) >>> 0;
        let z = state;
        z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
        z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
        return (z ^ (z >>> 16)) >>> 0;
    };
}

export function createRng(seed) {
    const init = splitmix32(seed);
    let a = init(), b = init(), c = init(), d = init();
    const next = () => {
        // sfc32
        const t = (((a + b) >>> 0) + d) >>> 0;
        d = (d + 1) >>> 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) >>> 0;
        c = ((c << 21) | (c >>> 11)) >>> 0;
        c = (c + t) >>> 0;
        return t / 4294967296;
    };
    return {
        seed,
        next,
        die(sides) {
            return 1 + Math.floor(next() * sides);
        },
        d20() {
            return 1 + Math.floor(next() * 20);
        },
        chance(probability) {
            return next() < probability;
        }
    };
}

export function runSeed(baseSeed, index) {
    return (Math.imul((baseSeed >>> 0) ^ 0x5bd1e995, 0x01000193) + Math.imul(index + 1, 0x9e3779b1)) >>> 0;
}
