export function createRng(seed: number) {
  let state = seed
  return function next() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)] as T
}

export function pickWeighted<T>(rng: () => number, items: readonly [T, number][]): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rng() * total
  for (const [item, weight] of items) {
    roll -= weight
    if (roll <= 0) return item
  }
  return items[items.length - 1][0]
}

export function intBetween(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}
