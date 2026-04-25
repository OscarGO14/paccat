# PacCat — Pac-Man-style game with cats and vacuums

## Context
The user wants a Pac-Man clone with a personal twist: the player controls a cat (skins: **Mapa**, a tabby like Silvestre; and **Lilith**, a black cat), eats cat food across the maze, and is chased by **vacuum cleaners** instead of ghosts. The project folder `C:\Users\ross_\Documents\www\games\paccat` is empty — this is a greenfield build.

Goal of this plan: stand up a minimal but real, playable v1 (one maze, one cat skin, one vacuum) so the core game feel is locked in before expanding to multiple skins, vacuum types, and levels.

## Stack (confirmed with user)
- **Language:** TypeScript
- **Build tool:** Vite
- **Game engine:** Phaser 3 (`phaser` npm package)
- **Target:** Browser only (desktop + mobile web), static site hostable on GitHub Pages / Netlify
- **Art:** Free CC0 sprite packs from itch.io / OpenGameArt (placeholders during dev)
- **MVP scope:** 1 level, 1 cat skin (Mapa), 1 vacuum enemy

Why this stack: Phaser ships tilemap loading, arcade physics, sprite animation, input, and audio out of the box — it removes ~80% of the boilerplate a Pac-Man clone needs. Vite gives instant hot reload. TypeScript keeps the AI state machine and game-state code honest.

## Project layout
```
paccat/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── assets/
│       ├── sprites/        # cat + vacuum spritesheets
│       ├── tiles/          # maze tileset
│       ├── maps/           # level1.json (Tiled export)
│       └── audio/          # chomp, hit, win SFX
└── src/
    ├── main.ts             # Phaser game bootstrap
    ├── config.ts           # tile size, speeds, colors
    ├── scenes/
    │   ├── BootScene.ts    # asset preload
    │   ├── MenuScene.ts    # skin select (stub: only Mapa for MVP)
    │   ├── GameScene.ts    # the maze, cat, vacuum, food
    │   └── HUDScene.ts     # score, lives
    ├── entities/
    │   ├── Cat.ts          # player sprite + input
    │   └── Vacuum.ts       # enemy sprite + AI
    ├── ai/
    │   └── chase.ts        # grid-based pathfinding (BFS to player tile)
    └── types.ts            # shared types (Skin, VacuumKind, Direction)
```

## MVP feature checklist
1. **Maze**: a tilemap (built in [Tiled](https://www.mapeditor.org/), exported to JSON) with walls and walkable corridors. One level for v1.
2. **Cat (player)**: 4-direction grid movement, snaps to corridors, animated walk cycle. Mapa skin only.
3. **Cat food**: pellet sprites placed on every walkable tile. Eating increments score and removes pellet.
4. **Vacuum (enemy)**: one vacuum that chases the cat. Use BFS on the tile grid to pick the next tile toward the player (simple, readable, good enough for v1).
5. **Collision**: cat ↔ vacuum = lose a life / game over. Cat ↔ wall = blocked by Phaser arcade physics.
6. **Win condition**: all pellets eaten → "You won!" screen.
7. **Lose condition**: vacuum touches cat → "Game over" screen with restart.
8. **HUD**: score + lives, separate Phaser scene rendered on top.
9. **Input**: arrow keys + WASD on desktop; on-screen swipe/d-pad on mobile (Phaser virtual joystick plugin or simple touch zones).
10. **Audio**: chomp, hit, win SFX (optional for v1, but cheap to add).

## Key design decisions
- **Grid-based movement**, not free 2D. Each entity has a `tileX, tileY` and moves between tile centers. This is how the original Pac-Man works and makes AI/collision dramatically simpler.
- **Tile size**: 32×32 px. Maze ~28×31 tiles (Pac-Man dimensions) = 896×992 canvas, scales down on mobile via Phaser `Scale.FIT`.
- **Vacuum AI for v1**: pure BFS chase. Later, add Pac-Man's classic 4 personalities (chase, ambush, patrol, random) when a second/third vacuum is introduced.
- **Skin system from day 1, even with one skin**: `Cat` constructor takes a `Skin` enum so adding Lilith is just a new spritesheet + enum value, not a refactor.
- **Vacuum kind system from day 1**: same pattern — `Vacuum` takes a `VacuumKind` enum so adding new vacuums is additive.

## Verification (how we'll know v1 works)
1. `npm run dev` opens the game at `http://localhost:5173`.
2. Cat moves with arrow keys, blocked by walls, animates while moving.
3. Eating a pellet plays chomp SFX, increments score in HUD, removes pellet.
4. Vacuum spawns, pathfinds toward cat, collides → "Game over" screen.
5. Eat every pellet → "You won!" screen.
6. Page reload restarts cleanly.
7. Test on mobile Chrome (responsive canvas, touch input works).
8. `npm run build` produces a `dist/` folder that can be served as a static site.

## Out of scope for v1 (next iterations)
- Lilith skin + skin select menu
- Multiple vacuum types with distinct AI personalities
- Multiple levels / level progression
- High-score persistence (localStorage)
- Power-ups (e.g., a "mop" pellet that lets the cat scare vacuums)
- PWA / installable packaging

## Critical files to create
- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- `src/main.ts` — Phaser game config, scene list
- `src/scenes/BootScene.ts` — preloads spritesheets, tilemap, audio
- `src/scenes/GameScene.ts` — core gameplay
- `src/entities/Cat.ts`, `src/entities/Vacuum.ts`
- `src/ai/chase.ts` — BFS chase
- `public/assets/maps/level1.json` — Tiled-exported maze