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
  '#.....#V#.....#',
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
