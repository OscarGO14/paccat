import Phaser from 'phaser';
import { TILE, SPEED } from '../config';
import { DIR_VECTORS } from '../types';
import { isWalkable } from '../ai/chase';
export class Cat extends Phaser.GameObjects.Sprite {
    constructor(scene, tileX, tileY, skin) {
        super(scene, tileX * TILE + TILE / 2, tileY * TILE + TILE / 2, `cat-${skin}`);
        this.skin = skin;
        this.dir = 'none';
        this.nextDir = 'none';
        this.targetX = 0;
        this.targetY = 0;
        this.moving = false;
        scene.add.existing(this);
        this.tileX = tileX;
        this.tileY = tileY;
        this.targetX = this.x;
        this.targetY = this.y;
        this.setDepth(10);
    }
    setNextDirection(d) {
        this.nextDir = d;
    }
    update(dt, grid) {
        if (this.moving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.hypot(dx, dy);
            const step = (SPEED.cat * dt) / 1000;
            if (dist <= step) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.moving = false;
            }
            else {
                this.x += (dx / dist) * step;
                this.y += (dy / dist) * step;
            }
            this.updateRotation();
            return;
        }
        let chosen = 'none';
        if (this.nextDir !== 'none' && this.canMove(this.nextDir, grid)) {
            chosen = this.nextDir;
        }
        else if (this.canMove(this.dir, grid)) {
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
        }
        else {
            this.dir = 'none';
        }
        this.updateRotation();
    }
    canMove(d, grid) {
        if (d === 'none')
            return false;
        const [dx, dy] = DIR_VECTORS[d];
        return isWalkable(grid, this.tileX + dx, this.tileY + dy);
    }
    updateRotation() {
        switch (this.dir) {
            case 'right':
                this.setFlipX(false);
                this.setAngle(0);
                break;
            case 'left':
                this.setFlipX(true);
                this.setAngle(0);
                break;
            case 'up':
                this.setFlipX(false);
                this.setAngle(-90);
                break;
            case 'down':
                this.setFlipX(false);
                this.setAngle(90);
                break;
        }
    }
}
