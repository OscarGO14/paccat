import Phaser from 'phaser';
import { TILE, MAZE, MAZE_COLS, MAZE_ROWS, COLORS, POWER_TILES, POWER_DURATION } from '../config';
import { Cat } from '../entities/Cat';
import { Vacuum } from '../entities/Vacuum';
import type { Direction, Skin, VacuumKind } from '../types';

export class GameScene extends Phaser.Scene {
  private grid: string[] = [];
  private cat!: Cat;
  private vacuum!: Vacuum;
  private vacSpawnX = 7;
  private vacSpawnY = 7;
  private foodTiles = new Map<string, Phaser.GameObjects.Image>();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private over = false;
  private overlay?: Phaser.GameObjects.Container;
  private touchStart?: { x: number; y: number };
  private powerMode = false;
  private powerTimer = 0;

  constructor() { super('Game'); }

  create() {
    this.over = false;
    this.powerMode = false;
    this.powerTimer = 0;
    this.foodTiles.clear();
    this.cameras.main.setBackgroundColor(COLORS.bg);
    this.grid = MAZE.slice();

    this.buildMaze();

    let pX = 1, pY = 1;
    this.vacSpawnX = 7; this.vacSpawnY = 7;
    for (let y = 0; y < MAZE_ROWS; y++) {
      for (let x = 0; x < MAZE_COLS; x++) {
        const c = MAZE[y][x];
        if (c === 'P') { pX = x; pY = y; }
        if (c === 'V') { this.vacSpawnX = x; this.vacSpawnY = y; }
      }
    }

    const skin: Skin = (this.registry.get('skin') as Skin) ?? 'mapa';
    const vacKind: VacuumKind = (this.registry.get('vacuum') as VacuumKind) ?? 'classic';
    this.cat = new Cat(this, pX, pY, skin);
    this.vacuum = new Vacuum(this, this.vacSpawnX, this.vacSpawnY, vacKind);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' }) as never;

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.over) { this.restart(); return; }
      this.touchStart = { x: p.x, y: p.y };
    });
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (!this.touchStart) return;
      const dx = p.x - this.touchStart.x;
      const dy = p.y - this.touchStart.y;
      this.touchStart = undefined;
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      if (Math.abs(dx) > Math.abs(dy)) this.cat.setNextDirection(dx > 0 ? 'right' : 'left');
      else this.cat.setNextDirection(dy > 0 ? 'down' : 'up');
    });

    this.registry.set('score', 0);
    this.registry.set('lives', 3);
    this.events.emit('hud:update');
  }

  private buildMaze() {
    for (let y = 0; y < MAZE_ROWS; y++) {
      for (let x = 0; x < MAZE_COLS; x++) {
        const c = MAZE[y][x];
        const px = x * TILE + TILE / 2;
        const py = y * TILE + TILE / 2;
        if (c === '#') {
          this.add.image(px, py, 'wall');
        } else if (c === '.' || c === 'P') {
          const key = `${x},${y}`;
          const isPower = POWER_TILES.has(key);
          const food = this.add.image(px, py, isPower ? 'food-power' : 'food');
          this.foodTiles.set(key, food);
        }
      }
    }
    const w = MAZE_COLS * TILE;
    const h = MAZE_ROWS * TILE;
    this.cameras.main.setBounds(0, 0, w, h);
    this.scale.setGameSize(w, h);
  }

  update(_time: number, delta: number) {
    if (this.over) return;

    if (this.powerMode) {
      this.powerTimer -= delta;
      if (this.powerTimer <= 0) this.deactivatePowerMode();
    }

    const dir = this.readInputDirection();
    if (dir !== 'none') this.cat.setNextDirection(dir);

    this.cat.update(delta, this.grid);
    this.vacuum.update(delta, this.grid, this.cat.tileX, this.cat.tileY);

    const key = `${this.cat.tileX},${this.cat.tileY}`;
    const food = this.foodTiles.get(key);
    if (food) {
      food.destroy();
      this.foodTiles.delete(key);
      const isPower = POWER_TILES.has(key);
      const earned = isPower ? 50 : 10;
      if (isPower) this.activatePowerMode();
      const score = (this.registry.get('score') as number) + earned;
      this.registry.set('score', score);
      this.events.emit('hud:update');
      if (this.foodTiles.size === 0) this.win();
    }

    if (this.cat.tileX === this.vacuum.tileX && this.cat.tileY === this.vacuum.tileY) {
      if (this.powerMode) {
        this.eatVacuum();
      } else {
        this.lose();
      }
    }
  }

  private activatePowerMode() {
    this.powerMode = true;
    this.powerTimer = POWER_DURATION;
    this.vacuum.setScared(true);
  }

  private deactivatePowerMode() {
    this.powerMode = false;
    this.vacuum.setScared(false);
  }

  private eatVacuum() {
    const score = (this.registry.get('score') as number) + 200;
    this.registry.set('score', score);
    this.events.emit('hud:update');
    this.vacuum.setScared(false);
    this.vacuum.tileX = this.vacSpawnX;
    this.vacuum.tileY = this.vacSpawnY;
    this.vacuum.setPosition(
      this.vacSpawnX * TILE + TILE / 2,
      this.vacSpawnY * TILE + TILE / 2,
    );
    this.deactivatePowerMode();
  }

  private readInputDirection(): Direction {
    if (this.cursors.left?.isDown || this.wasd.left.isDown) return 'left';
    if (this.cursors.right?.isDown || this.wasd.right.isDown) return 'right';
    if (this.cursors.up?.isDown || this.wasd.up.isDown) return 'up';
    if (this.cursors.down?.isDown || this.wasd.down.isDown) return 'down';
    return 'none';
  }

  private win() {
    this.over = true;
    this.showOverlay('¡Ganaste!', '#b6ff5e');
  }

  private lose() {
    this.over = true;
    this.showOverlay('Game Over', '#ff6fa8');
  }

  private showOverlay(title: string, color: string) {
    const w = MAZE_COLS * TILE;
    const h = MAZE_ROWS * TILE;
    const bg = this.add.rectangle(0, 0, w, h, 0x1c1330, 0.8).setOrigin(0);
    const t1 = this.add.text(w / 2, h / 2 - 24, title, {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '36px',
      fontStyle: 'bold',
      color,
    }).setOrigin(0.5);
    const t2 = this.add.text(w / 2, h / 2 + 20, 'Tap or press SPACE to play again', {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '15px',
      color: '#ffe6c4',
    }).setOrigin(0.5);
    this.overlay = this.add.container(0, 0, [bg, t1, t2]).setDepth(100);

    this.input.keyboard!.once('keydown-SPACE', () => this.restart());
  }

  private restart() {
    this.overlay?.destroy();
    this.scene.restart();
  }
}
