/**
 * SotDL castings by Power (rows) and spell rank (columns).
 * Values are castings for EACH known spell of that rank (core book p.112).
 * You cannot learn/cast ranks above your Power.
 */
const TABLE: number[][] = [
  /* Power 0 */ [1],
  /* Power 1 */ [2, 1],
  /* Power 2 */ [3, 2, 1],
  /* Power 3 */ [4, 2, 2, 1],
  /* Power 4 */ [5, 2, 2, 2, 1],
  /* Power 5 */ [6, 3, 2, 2, 2, 1],
  /* Power 6 */ [7, 3, 2, 2, 2, 1, 1],
  /* Power 7 */ [8, 3, 2, 2, 2, 1, 1, 1],
  /* Power 8 */ [9, 3, 3, 2, 2, 2, 1, 1, 1],
  /* Power 9 */ [10, 3, 3, 3, 2, 2, 1, 1, 1, 1],
  /* Power 10 */ [11, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1],
]

export function maxCastings(power: number, rank: number): number {
  const p = Math.max(0, Math.min(power, TABLE.length - 1))
  const row = TABLE[p]
  if (rank < 0 || rank >= row.length) return 0
  return row[rank] ?? 0
}

export function canLearnRank(power: number, rank: number): boolean {
  return rank >= 0 && rank <= power
}
