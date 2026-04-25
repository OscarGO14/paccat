export const TILE = 32;
export const COLORS = {
    bg: 0x000010,
    wall: 0x1a1aff,
    wallEdge: 0x6a6aff,
    food: 0xf4d06f,
    catMapa: 0xd99a4a,
    catMapaDark: 0x8a5a2b,
    catLilith: 0x222222,
    catLilithEye: 0xa6f06b,
    vacuumBody: 0x9aa0a6,
    vacuumDark: 0x5f6368,
    vacuumLight: 0xff5252,
};
export const SPEED = {
    cat: 110,
    vacuum: 90,
};
// Maze legend:
//   # = wall
//   . = food
//   space = empty corridor (no food)
//   P = player spawn (also a food tile)
//   V = vacuum spawn (empty)
export const MAZE = [
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
