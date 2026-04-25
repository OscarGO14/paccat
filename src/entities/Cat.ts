import Phaser from 'phaser';
import { TILE, SPEED } from '../config';
import { DIR_VECTORS, type Direction, type Skin } from '../types';
import { isWalkable } from '../ai/chase';

export class Cat extends Phaser.GameObjects.Sprite {
  tileX: number;
  tileY: number;
  dir: Direction = 'none';
  nextDir: Direction = 'none';
  private targetX = 0;
  private targetY = 0;
  private moving = false;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number, public skin: Skin) {
    super(scene, tileX * TILE + TILE / 2, tileY * TILE + TILE / 2, `cat-${skin}`);
    scene.add.existing(this);
    this.tileX = tileX;
    this.tileY = tileY;
    this.targetX = this.x;
    this.targetY = this.y;
    this.setDepth(10);
  }

  setNextDirection(d: Direction) {
    this.nextDir = d;
  }

  update(dt: number, grid: string[]) {
    if (this.moving) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);
      const step = (SPEED.cat * dt) / 1000;
      if (dist <= step) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.moving = false;
      } else {
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
      }
      this.updateRotation();
      return;
    }

    let chosen: Direction = 'none';
    if (this.nextDir !== 'none' && this.canMove(this.nextDir, grid)) {
      chosen = this.nextDir;
    } else if (this.canMove(this.dir, grid)) {
      chosen = this.dir;
    }

    if (chosen !== 'none') {
      this.dir = chosen;
      const [dxT, dyT] = DIR_VECTORS[chosen];
      this.tileX += dxT;
      this.tileY += dyT;
      this.targetX = this.tileX * TILE + TILE / 2;
      this.targetY = this.tileY * TILE + TILE / 2;
      this.moving = true;
    } else {
      this.dir = 'none';
    }
    this.updateRotation();
  }

  private canMove(d: Direction, grid: string[]): boolean {
    if (d === 'none') return false;
    const [dx, dy] = DIR_VECTORS[d];
    return isWalkable(grid, this.tileX + dx, this.tileY + dy);
  }

  private updateRotation() {
    switch (this.dir) {
      case 'right': this.setFlipX(false); this.setAngle(0); break;
      case 'left':  this.setFlipX(true);  this.setAngle(0); break;
      case 'up':    this.setFlipX(false); this.setAngle(-90); break;
      case 'down':  this.setFlipX(false); this.setAngle(90); break;
    }
  }
}
