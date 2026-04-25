# PacCat

A Pac-Man inspired browser game starring hungry cats and angry robot vacuums.

## How to Play

Move your cat through the maze and eat all the fish before the vacuum catches you.

**Controls**
- **Arrow keys** or **WASD** — move
- **Swipe** — move (touch / mobile)
- **Space** — restart after game over

**Objective**: Clear every fish from the maze to win. Avoid the vacuum — it chases you using pathfinding.

**Power pellets**: The four tuna cans at the maze corners give you 6 seconds of power mode. During power mode the vacuum turns blue and flees. Chase it down for 200 bonus points — it respawns at its den if you catch it.

**Scoring**
| Action | Points |
|---|---|
| Eat a fish | 10 |
| Eat a tuna can | 50 |
| Eat a scared vacuum | 200 |

## Characters

| Skin | Description |
|---|---|
| **Mapa** | White & black, Silvestre-style, yellow eyes |
| **Lilith** | All black, lime-green eyes |

Skin is set via `this.registry.set('skin', 'mapa' \| 'lilith')` before the Game scene starts.

## Development

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build → dist/
```

Requires Node 18+. Built with [Phaser 3](https://phaser.io/) and [Vite](https://vitejs.dev/).

## Project Structure

```
src/
  config.ts          # palette, maze layout, speeds, power-pellet positions
  main.ts            # Phaser game config
  scenes/
    BootScene.ts     # generates all sprites via Canvas 2D at startup
    GameScene.ts     # maze, input, collision, power-mode logic
    HUDScene.ts      # score + lives overlay
  entities/
    Cat.ts           # player movement + tile-based grid snapping
    Vacuum.ts        # enemy AI (BFS chase / flee)
  ai/
    chase.ts         # BFS pathfinding helpers
  types.ts           # shared type aliases
```

All sprites are drawn procedurally in `BootScene` using the Canvas 2D API — no external image assets required.
