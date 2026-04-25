import Phaser from 'phaser';
import { TILE, SPEED } from '../config';
import { DIR_VECTORS, OPPOSITE } from '../types';
import { bfsNextDirection, isWalkable } from '../ai/chase';
export class Vacuum extends Phaser.GameObjects.Sprite {
    constructor(scene, tileX, tileY, kind) {
        super(scene, tileX * TILE + TILE / 2, tileY * TILE + TILE / 2, `vacuum-${kind}`);
        this.kind = kind;
        this.dir = 'none';
        this.targetX = 0;
        this.targetY = 0;
        this.moving = false;
        scene.add.existing(this);
        this.tileX = tileX;
        this.tileY = tileY;
        this.targetX = this.x;
        this.targetY = this.y;
        this.setDepth(9);
    }
    update(dt, grid, targetTileX, targetTileY) {
        if (this.moving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.hypot(dx, dy);
            const step = (SPEED.vacuum * dt) / 1000;
            if (dist <= step) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.moving = false;
            }
            else {
                this.x += (dx / dist) * step;
                this.y += (dy / dist) * step;
            }
            return;
        }
        const forbidden = OPPOSITE[this.dir];
        let chosen = bfsNextDirection(grid, this.tileX, this.tileY, targetTileX, targetTileY, forbidden);
        if (chosen === 'none') {
            const options = ['up', 'down', 'left', 'right'];
            for (const d of options) {
                if (d === forbidden)
                    continue;
                const [dx, dy] = DIR_VECTORS[d];
                if (isWalkable(grid, this.tileX + dx, this.tileY + dy)) {
                    chosen = d;
                    break;
                }
            }
        }
        if (chosen === 'none')
            return;
        this.dir = chosen;
        const [dxT, dyT] = DIR_VECTORS[chosen];
        this.tileX += dxT;
        this.tileY += dyT;
        this.targetX = this.tileX * TILE + TILE / 2;
        this.targetY = this.tileY * TILE + TILE / 2;
        this.moving = true;
    }
}
