import Phaser from 'phaser';
import { TILE, MAZE, MAZE_COLS, MAZE_ROWS, COLORS } from '../config';
import { Cat } from '../entities/Cat';
import { Vacuum } from '../entities/Vacuum';
export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.grid = [];
        this.foodTiles = new Map();
        this.over = false;
    }
    create() {
        this.over = false;
        this.foodTiles.clear();
        this.cameras.main.setBackgroundColor(COLORS.bg);
        this.grid = MAZE.slice();
        this.buildMaze();
        let pX = 1, pY = 1, vX = 7, vY = 7;
        for (let y = 0; y < MAZE_ROWS; y++) {
            for (let x = 0; x < MAZE_COLS; x++) {
                const c = MAZE[y][x];
                if (c === 'P') {
                    pX = x;
                    pY = y;
                }
                if (c === 'V') {
                    vX = x;
                    vY = y;
                }
            }
        }
        const skin = this.registry.get('skin') ?? 'mapa';
        const vacKind = this.registry.get('vacuum') ?? 'classic';
        this.cat = new Cat(this, pX, pY, skin);
        this.vacuum = new Vacuum(this, vX, vY, vacKind);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.input.on('pointerdown', (p) => {
            if (this.over) {
                this.restart();
                return;
            }
            this.touchStart = { x: p.x, y: p.y };
        });
        this.input.on('pointerup', (p) => {
            if (!this.touchStart)
                return;
            const dx = p.x - this.touchStart.x;
            const dy = p.y - this.touchStart.y;
            this.touchStart = undefined;
            if (Math.abs(dx) < 12 && Math.abs(dy) < 12)
                return;
            if (Math.abs(dx) > Math.abs(dy))
                this.cat.setNextDirection(dx > 0 ? 'right' : 'left');
            else
                this.cat.setNextDirection(dy > 0 ? 'down' : 'up');
        });
        this.registry.set('score', 0);
        this.registry.set('lives', 3);
        this.events.emit('hud:update');
    }
    buildMaze() {
        for (let y = 0; y < MAZE_ROWS; y++) {
            for (let x = 0; x < MAZE_COLS; x++) {
                const c = MAZE[y][x];
                const px = x * TILE + TILE / 2;
                const py = y * TILE + TILE / 2;
                if (c === '#') {
                    this.add.image(px, py, 'wall');
                }
                else if (c === '.' || c === 'P') {
                    const food = this.add.image(px, py, 'food');
                    this.foodTiles.set(`${x},${y}`, food);
                }
            }
        }
        const w = MAZE_COLS * TILE;
        const h = MAZE_ROWS * TILE;
        this.cameras.main.setBounds(0, 0, w, h);
        this.scale.setGameSize(w, h);
    }
    update(_time, delta) {
        if (this.over)
            return;
        const dir = this.readInputDirection();
        if (dir !== 'none')
            this.cat.setNextDirection(dir);
        this.cat.update(delta, this.grid);
        this.vacuum.update(delta, this.grid, this.cat.tileX, this.cat.tileY);
        const key = `${this.cat.tileX},${this.cat.tileY}`;
        const food = this.foodTiles.get(key);
        if (food) {
            food.destroy();
            this.foodTiles.delete(key);
            const score = this.registry.get('score') + 10;
            this.registry.set('score', score);
            this.events.emit('hud:update');
            if (this.foodTiles.size === 0)
                this.win();
        }
        if (this.cat.tileX === this.vacuum.tileX && this.cat.tileY === this.vacuum.tileY) {
            this.lose();
        }
    }
    readInputDirection() {
        if (this.cursors.left?.isDown || this.wasd.left.isDown)
            return 'left';
        if (this.cursors.right?.isDown || this.wasd.right.isDown)
            return 'right';
        if (this.cursors.up?.isDown || this.wasd.up.isDown)
            return 'up';
        if (this.cursors.down?.isDown || this.wasd.down.isDown)
            return 'down';
        return 'none';
    }
    win() {
        this.over = true;
        this.showOverlay('You won!', '#a6f06b');
    }
    lose() {
        this.over = true;
        this.showOverlay('Game over', '#ff5252');
    }
    showOverlay(title, color) {
        const w = MAZE_COLS * TILE;
        const h = MAZE_ROWS * TILE;
        const bg = this.add.rectangle(0, 0, w, h, 0x000000, 0.7).setOrigin(0);
        const t1 = this.add.text(w / 2, h / 2 - 20, title, {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '32px',
            color,
        }).setOrigin(0.5);
        const t2 = this.add.text(w / 2, h / 2 + 20, 'Tap or press SPACE to play again', {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
        }).setOrigin(0.5);
        this.overlay = this.add.container(0, 0, [bg, t1, t2]).setDepth(100);
        this.input.keyboard.once('keydown-SPACE', () => this.restart());
    }
    restart() {
        this.overlay?.destroy();
        this.scene.restart();
    }
}
