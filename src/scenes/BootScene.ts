import Phaser from 'phaser';
import { TILE, COLORS } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.makeWallTexture();
    this.makeFoodTexture();
    this.makeCatTexture('cat-mapa', COLORS.catMapa, COLORS.catMapaDark);
    this.makeCatTexture('cat-lilith', COLORS.catLilith, COLORS.catLilithEye);
    this.makeVacuumTexture('vacuum-classic', COLORS.vacuumBody, COLORS.vacuumDark);
    this.makeVacuumTexture('vacuum-robot', 0xc4c4c4, 0x303030);
    this.makeVacuumTexture('vacuum-upright', 0xff8a65, 0x4a2c20);
  }

  create() {
    this.scene.start('Game');
    this.scene.launch('HUD');
  }

  private makeWallTexture() {
    const g = this.add.graphics();
    g.fillStyle(COLORS.wall, 1);
    g.fillRect(0, 0, TILE, TILE);
    g.lineStyle(2, COLORS.wallEdge, 1);
    g.strokeRect(1, 1, TILE - 2, TILE - 2);
    g.generateTexture('wall', TILE, TILE);
    g.destroy();
  }

  private makeFoodTexture() {
    const g = this.add.graphics();
    g.fillStyle(COLORS.food, 1);
    g.fillCircle(TILE / 2, TILE / 2, 4);
    g.generateTexture('food', TILE, TILE);
    g.destroy();
  }

  private makeCatTexture(key: string, body: number, accent: number) {
    const g = this.add.graphics();
    const cx = TILE / 2;
    const cy = TILE / 2 + 2;
    const r = TILE / 2 - 4;
    // ears
    g.fillStyle(body, 1);
    g.fillTriangle(cx - r + 2, cy - r + 4, cx - 2, cy - r - 6, cx - 2, cy - r + 6);
    g.fillTriangle(cx + r - 2, cy - r + 4, cx + 2, cy - r - 6, cx + 2, cy - r + 6);
    // body
    g.fillCircle(cx, cy, r);
    // eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - 4, cy - 2, 2.5);
    g.fillCircle(cx + 4, cy - 2, 2.5);
    g.fillStyle(accent, 1);
    g.fillCircle(cx - 4, cy - 2, 1.2);
    g.fillCircle(cx + 4, cy - 2, 1.2);
    // mouth (a small chomp wedge pointing right)
    g.fillStyle(0x000000, 1);
    g.beginPath();
    g.moveTo(cx + 2, cy + 3);
    g.lineTo(cx + r - 2, cy);
    g.lineTo(cx + r - 2, cy + 6);
    g.closePath();
    g.fillPath();
    g.generateTexture(key, TILE, TILE);
    g.destroy();
  }

  private makeVacuumTexture(key: string, body: number, dark: number) {
    const g = this.add.graphics();
    const w = TILE - 6;
    const h = TILE - 10;
    const x = (TILE - w) / 2;
    const y = (TILE - h) / 2 + 2;
    // body
    g.fillStyle(body, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    // intake stripe
    g.fillStyle(dark, 1);
    g.fillRect(x + 2, y + h - 5, w - 4, 3);
    // handle
    g.fillStyle(dark, 1);
    g.fillRect(TILE / 2 - 1, 2, 2, y - 2);
    g.fillCircle(TILE / 2, 2, 2);
    // light
    g.fillStyle(COLORS.vacuumLight, 1);
    g.fillCircle(x + 4, y + 4, 2);
    g.generateTexture(key, TILE, TILE);
    g.destroy();
  }
}
