import Phaser from 'phaser';
import { TILE, MAZE_COLS, MAZE_ROWS, COLORS, LEVELS } from '../config';

export class TransitionScene extends Phaser.Scene {
  constructor() { super('Transition'); }

  create() {
    const w = MAZE_COLS * TILE;
    const h = MAZE_ROWS * TILE;
    const completedLevel: number = (this.registry.get('level') as number) ?? 0;
    const nextLevel = completedLevel + 1;
    const score: number = (this.registry.get('score') as number) ?? 0;

    this.cameras.main.setBackgroundColor(COLORS.bg);

    const cx = w / 2;
    const cy = h / 2;

    this.add.text(cx, cy - 90, `¡Nivel ${completedLevel + 1} Completado!`, {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#b6ff5e',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 40, `Puntuación: ${score}`, {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '20px',
      color: '#ffe6c4',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 10, `🔓 ¡Nivel ${nextLevel + 1} Desbloqueado!`, {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ff8a5c',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 58, `¿Preparado para el siguiente escenario?`, {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '15px',
      color: '#7cf5c8',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 90, 'Pulsa ESPACIO o toca para continuar', {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '13px',
      color: '#888899',
    }).setOrigin(0.5);

    const proceed = () => {
      this.registry.set('level', nextLevel);
      this.scene.stop('HUD');
      this.scene.start('Game');
      this.scene.launch('HUD');
    };

    this.input.keyboard!.once('keydown-SPACE', proceed);
    this.input.once('pointerup', (_p: Phaser.Input.Pointer) => proceed());

    // Prevent accidental instant-skip from the same click that triggered win
    this.input.enabled = false;
    this.time.delayedCall(500, () => { this.input.enabled = true; });

    // Preview thumbnail of next maze
    this._drawMinimap(nextLevel, cx, cy - 170);
  }

  private _drawMinimap(levelIdx: number, cx: number, cy: number) {
    const { maze } = LEVELS[Math.min(levelIdx, LEVELS.length - 1)];
    const rows = maze.length;
    const cols = maze[0].length;
    const cellSize = 6;
    const totalW = cols * cellSize;
    const totalH = rows * cellSize;
    const startX = cx - totalW / 2;
    const startY = cy - totalH / 2;

    const gfx = this.add.graphics();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const c = maze[y][x];
        if (c === '#') {
          gfx.fillStyle(0x3ad6a3, 0.7);
        } else if (c === 'V') {
          gfx.fillStyle(0xff8a5c, 0.9);
        } else if (c === 'P') {
          gfx.fillStyle(0xfbf6ee, 0.9);
        } else {
          gfx.fillStyle(0x1c1330, 0.4);
        }
        gfx.fillRect(startX + x * cellSize, startY + y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
}
