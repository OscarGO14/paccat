export const TILE = 32;

export const COLORS = {
  bg:           0x1c1330,
  bgDeep:       0x120a23,
  wall:         0x3ad6a3,
  wallEdge:     0x1f8c6a,
  wallGlow:     0x7cf5c8,
  food:         0xff8a5c,
  foodPower:    0xff6fa8,
  catMapa:      0xfbf6ee,
  catMapaDark:  0x1a1622,
  catMapaEye:   0xffd45c,
  catLilith:    0x1a1622,
  catLilithEye: 0xb6ff5e,
  vacuumBody:   0xff8a5c,
  vacuumDark:   0x3a2a3f,
  vacuumLight:  0xff5470,
};

export const SPEED = {
  cat: 110,
  vacuum: 90,
};

export const POWER_DURATION = 6000;

// Maze legend:
//   # = wall
//   . = food
//   space = empty corridor (no food)
//   P = player spawn (also a food tile)
//   V = vacuum spawn (empty)
export const MAZE: string[] = [
  '###############',
  '#P............#',
  '#.###.###.###.#',
  '#.............#',
  '#.###.#.#.###.#',
  '#.....#.#.....#',
  '###.#######.###',
  '#.....#V .....#',
  '###.#######.###',
  '#.....#.#.....#',
  '#.###.#.#.###.#',
  '#.............#',
  '#.###.###.###.#',
  '#.............#',
  '###############',
];

export const MAZE_COLS = MAZE[0].length;
export const MAZE_ROWS = MAZE.length;

// Tuna-can power pellets at the four corners of the play area
export const POWER_TILES = new Set(['1,1', '13,1', '1,13', '13,13']);

// ── Level 2 ─────────────────────────────────────────────────────────
// More open layout: two full horizontal corridors (rows 5 & 9)
// and segmented center requiring detours — different feel to level 1.
export const MAZE_2: string[] = [
  '###############',
  '#P.....#......#',
  '#.###.#.#.###.#',
  '#.#...#.#...#.#',
  '#.#.###.###.#.#',
  '#.............#',
  '###.##.#.##.###',
  '#...#..V..#...#',
  '###.##.#.##.###',
  '#.............#',
  '#.#.###.###.#.#',
  '#.#...#.#...#.#',
  '#.###.#.#.###.#',
  '#.....#.......#',
  '###############',
];

export const POWER_TILES_2 = new Set(['1,1', '13,1', '1,13', '13,13']);

// ── Level 3 ─────────────────────────────────────────────────────────
// Redesigned: Vertical segmented chambers (top/middle/bottom) with
// strategic vacuum control point. Three genuinely viable escape corridors
// (left, top-center, right). No dead-end traps.
export const MAZE_3: string[] = [
  '###############',
  '#P.....#......#',
  '#.#.#..#......#',
  '#...#..#.####.#',
  '#####..#.#..#.#',
  '#.....##.....#.',
  '#.#####.######.',
  '#.#...#...#...#',
  '#.#.###.#.#.###',
  '#...#.#.#.....#',
  '#.#.#.#V#####.#',
  '#.#.#.#.....#.#',
  '#...#.#.###.#.#',
  '#.#########..#.',
  '###############',
];

export const POWER_TILES_3 = new Set(['1,1', '13,1', '1,13', '13,13']);

export interface LevelConfig {
  maze: string[];
  powerTiles: Set<string>;
}

export const LEVELS: LevelConfig[] = [
  { maze: MAZE,   powerTiles: POWER_TILES },
  { maze: MAZE_2, powerTiles: POWER_TILES_2 },
  { maze: MAZE_3, powerTiles: POWER_TILES_3 },
];
