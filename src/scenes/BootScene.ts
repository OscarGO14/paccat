import Phaser from 'phaser';
import { TILE } from '../config';

// Design palette (matches sprites.jsx from the design file)
const C = {
  wall: '#3ad6a3', wallDark: '#1f8c6a', wallGlow: '#7cf5c8',
  pink: '#ff6fa8', pinkDeep: '#c2407a',
  salmon: '#ff8a5c', cream: '#ffe6c4', yellow: '#ffd45c',
  black: '#1a1622', blackHi: '#2e2840', white: '#fbf6ee',
  vacBody: '#ff8a5c', vacBodyHi: '#ffb487', vacDark: '#3a2a3f',
  vacRed: '#ff5470', vacChrome: '#d9d4c6',
  lime: '#b6ff5e',
};

type Ctx = CanvasRenderingContext2D;

// ── Canvas 2D helpers ───────────────────────────────────────────────

function fillEllipse(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, color: string, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function fillCircle(ctx: Ctx, cx: number, cy: number, r: number, color: string, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function fillPath(ctx: Ctx, d: string, color: string, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.fill(new Path2D(d)); ctx.restore();
}

function strokePath(ctx: Ctx, d: string, color: string, width: number, cap: CanvasLineCap = 'butt', alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color;
  ctx.lineWidth = width; ctx.lineCap = cap;
  ctx.stroke(new Path2D(d)); ctx.restore();
}

function fillRect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, radius = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath();
  if (radius > 0) ctx.roundRect(x, y, w, h, radius);
  else ctx.rect(x, y, w, h);
  ctx.fill(); ctx.restore();
}

function strokeRect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, width: number, radius = 0) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath();
  if (radius > 0) ctx.roundRect(x, y, w, h, radius);
  else ctx.rect(x, y, w, h);
  ctx.stroke(); ctx.restore();
}

function ellipseStroke(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, color: string, width: number) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// ── Sprite draw functions ──────────────────────────────────────────

function drawWall(ctx: Ctx) {
  fillRect(ctx, 1, 1, 30, 30, C.wall, 6);
  strokeRect(ctx, 1, 1, 30, 30, C.wallDark, 2, 6);
  fillRect(ctx, 3, 3, 26, 3, C.wallGlow, 1.5, 0.55);
}

function drawFoodFish(ctx: Ctx) {
  fillEllipse(ctx, 14, 16, 8, 5, C.salmon);
  ellipseStroke(ctx, 14, 16, 8, 5, C.pinkDeep, 0.6);
  fillPath(ctx, 'M22 16 L28 12 L26 16 L28 20 Z', C.salmon);
  strokePath(ctx, 'M22 16 L28 12 L26 16 L28 20 Z', C.pinkDeep, 0.5);
  fillCircle(ctx, 9, 15, 1.2, C.white);
  fillCircle(ctx, 9, 15, 0.6, C.black);
  strokePath(ctx, 'M12 13 Q11 16 12 19', C.pinkDeep, 0.5);
  fillEllipse(ctx, 14, 14, 3, 0.8, '#ffffff', 0.45);
}

function drawFoodCan(ctx: Ctx) {
  fillEllipse(ctx, 16, 27, 9, 1.5, '#000000', 0.25);
  fillRect(ctx, 6, 11, 20, 14, C.pink, 1.5);
  strokeRect(ctx, 6, 11, 20, 14, C.pinkDeep, 0.7, 1.5);
  fillEllipse(ctx, 16, 11, 10, 2.4, C.cream);
  ellipseStroke(ctx, 16, 11, 10, 2.4, C.pinkDeep, 0.6);
  fillEllipse(ctx, 16, 11, 8, 1.6, C.salmon);
  fillEllipse(ctx, 14, 18, 3.5, 2, C.cream);
  fillPath(ctx, 'M17.5 18 L20 16.5 L19 18 L20 19.5 Z', C.cream);
  fillCircle(ctx, 12.5, 17.5, 0.4, C.pinkDeep);
  fillRect(ctx, 6, 20, 20, 2, C.pinkDeep);
  ctx.save();
  ctx.fillStyle = C.cream; ctx.font = 'bold 2.5px monospace'; ctx.textAlign = 'center';
  ctx.fillText('YUM', 16, 21.5); ctx.restore();
  fillRect(ctx, 7, 13, 1.5, 10, '#ffffff', 0.5, 0.4);
}

function drawCatMapa(ctx: Ctx) {
  strokePath(ctx, 'M5 22 Q1 18 3 14 Q4 12 6 13', C.black, 3, 'round');
  fillEllipse(ctx, 16, 20, 11, 9, C.black);
  fillEllipse(ctx, 16, 22, 7, 6, C.white);
  fillEllipse(ctx, 11, 28, 2.3, 1.4, C.white);
  fillEllipse(ctx, 21, 28, 2.3, 1.4, C.white);
  fillCircle(ctx, 17, 14, 9, C.black);
  // White Silvestre face mask
  fillPath(ctx, 'M10 16 Q11 21 17 22 Q23 21 24 16 Q23 11 17 11 Q11 11 10 16 Z', C.white);
  fillPath(ctx, 'M9 9 L11 4 L14 8 Z', C.black);
  fillPath(ctx, 'M25 9 L23 4 L20 8 Z', C.black);
  fillPath(ctx, 'M11 7 L12 5 L13 7 Z', C.pink, 0.85);
  fillPath(ctx, 'M23 7 L22 5 L21 7 Z', C.pink, 0.85);
  fillEllipse(ctx, 13.5, 13, 2, 2.6, C.yellow);
  fillEllipse(ctx, 20.5, 13, 2, 2.6, C.yellow);
  fillRect(ctx, 13, 11.6, 1, 2.8, C.black);
  fillRect(ctx, 20, 11.6, 1, 2.8, C.black);
  fillCircle(ctx, 14.3, 11.7, 0.5, '#ffffff');
  fillCircle(ctx, 21.3, 11.7, 0.5, '#ffffff');
  fillPath(ctx, 'M15.8 16.2 L18 16.2 L16.9 17.4 Z', C.pinkDeep);
  strokePath(ctx, 'M16.9 17.4 Q15.7 19 14.6 17.8', C.black, 0.7, 'round');
  strokePath(ctx, 'M16.9 17.4 Q18.1 19 19.2 17.8', C.black, 0.7, 'round');
  fillEllipse(ctx, 16.9, 18.6, 0.7, 0.4, C.pink);
  strokePath(ctx, 'M8.5 17 L12.5 17.5', C.black, 0.4);
  strokePath(ctx, 'M8.5 18.5 L12.5 18.2', C.black, 0.4);
  strokePath(ctx, 'M25.5 17 L21.5 17.5', C.black, 0.4);
  strokePath(ctx, 'M25.5 18.5 L21.5 18.2', C.black, 0.4);
}

function drawCatLilith(ctx: Ctx) {
  strokePath(ctx, 'M5 22 Q1 18 3 14 Q4 12 6 13', C.black, 3, 'round');
  fillEllipse(ctx, 16, 20, 11, 9, C.black);
  fillCircle(ctx, 17, 14, 9, C.black);
  fillPath(ctx, 'M9 9 L11 4 L14 8 Z', C.black);
  fillPath(ctx, 'M25 9 L23 4 L20 8 Z', C.black);
  fillPath(ctx, 'M11 7 L12 5 L13 7 Z', C.pink, 0.85);
  fillPath(ctx, 'M23 7 L22 5 L21 7 Z', C.pink, 0.85);
  fillEllipse(ctx, 13, 17, 4, 2.5, C.blackHi, 0.6);
  fillEllipse(ctx, 13.5, 13, 1.8, 2.4, C.lime);
  fillEllipse(ctx, 20.5, 13, 1.8, 2.4, C.lime);
  fillRect(ctx, 13, 11.8, 1, 2.4, C.black);
  fillRect(ctx, 20, 11.8, 1, 2.4, C.black);
  fillCircle(ctx, 14.2, 11.8, 0.5, '#ffffff');
  fillCircle(ctx, 21.2, 11.8, 0.5, '#ffffff');
  fillPath(ctx, 'M16 16 L17.4 16 L16.7 17 Z', C.pink);
  strokePath(ctx, 'M16.7 17 Q15.8 18.5 15 17.7', C.black, 0.6);
  strokePath(ctx, 'M16.7 17 Q17.6 18.5 18.4 17.7', C.black, 0.6);
  strokePath(ctx, 'M9 17 L13 17.5', C.white, 0.4, 'butt', 0.7);
  strokePath(ctx, 'M9 18.5 L13 18.2', C.white, 0.4, 'butt', 0.7);
  strokePath(ctx, 'M25 17 L21 17.5', C.white, 0.4, 'butt', 0.7);
  strokePath(ctx, 'M25 18.5 L21 18.2', C.white, 0.4, 'butt', 0.7);
  fillEllipse(ctx, 11, 28, 2.3, 1.4, C.blackHi);
  fillEllipse(ctx, 21, 28, 2.3, 1.4, C.blackHi);
}

function drawVacuumRoomba(ctx: Ctx) {
  fillEllipse(ctx, 16, 29, 11, 1.6, '#ffffff', 0.18);
  strokePath(ctx, 'M3 20 L6 19', C.cream, 1, 'round');
  strokePath(ctx, 'M3.5 22 L6 21', C.cream, 1, 'round');
  strokePath(ctx, 'M29 20 L26 19', C.cream, 1, 'round');
  strokePath(ctx, 'M28.5 22 L26 21', C.cream, 1, 'round');
  fillEllipse(ctx, 16, 22, 12, 6, C.vacDark);
  fillEllipse(ctx, 16, 21, 12, 5.5, C.vacBody);
  fillPath(ctx, 'M5 21 Q5 13 16 13 Q27 13 27 21 Z', C.vacBodyHi);
  strokePath(ctx, 'M5 21 Q5 13 16 13 Q27 13 27 21', C.vacDark, 0.6);
  strokePath(ctx, 'M4 22 Q16 24 28 22', C.vacDark, 0.7);
  fillPath(ctx, 'M9 22 Q16 26 23 22 L23 24 Q16 27.5 9 24 Z', C.black);
  for (const d of [
    'M11 23 L12 25.5 L13 23 Z', 'M13 23.4 L14 26 L15 23.4 Z',
    'M15 23.6 L16 26.2 L17 23.6 Z', 'M17 23.6 L18 26.2 L19 23.6 Z',
    'M19 23.4 L20 26 L21 23.4 Z',
  ]) { fillPath(ctx, d, C.cream); }
  fillCircle(ctx, 12, 17, 1.6, C.white);
  fillCircle(ctx, 20, 17, 1.6, C.white);
  fillCircle(ctx, 12.3, 17.2, 0.9, C.black);
  fillCircle(ctx, 20.3, 17.2, 0.9, C.black);
  strokePath(ctx, 'M9.5 14.5 L14 16', C.vacDark, 1.3, 'round');
  strokePath(ctx, 'M22.5 14.5 L18 16', C.vacDark, 1.3, 'round');
  fillCircle(ctx, 16, 14.5, 0.9, C.vacRed);
  fillCircle(ctx, 16, 14.5, 0.4, '#ffffff', 0.8);
  fillRect(ctx, 13, 19.6, 6, 0.6, C.vacDark, 0.3, 0.5);
}

function drawVacuumUpright(ctx: Ctx) {
  fillRect(ctx, 15, 2, 2, 14, C.vacChrome, 1);
  fillCircle(ctx, 16, 2.5, 1.6, C.vacDark);
  fillPath(ctx, 'M9 10 Q9 8 11 8 L21 8 Q23 8 23 10 L23 18 L9 18 Z', C.pink);
  strokePath(ctx, 'M9 10 Q9 8 11 8 L21 8 Q23 8 23 10', C.pinkDeep, 0.6);
  fillRect(ctx, 10.5, 9.5, 2, 6, '#ffffff', 0.5, 0.3);
  strokePath(ctx, 'M21 12 Q26 13 25 18 Q24 22 20 22', C.vacDark, 1.6, 'round');
  ctx.save(); ctx.strokeStyle = C.vacChrome; ctx.lineWidth = 0.6;
  ctx.lineCap = 'round'; ctx.setLineDash([0.5, 1.2]);
  ctx.stroke(new Path2D('M21 12 Q26 13 25 18 Q24 22 20 22'));
  ctx.setLineDash([]); ctx.restore();
  fillPath(ctx, 'M5 20 L20 20 Q22 20 22 22 L22 25 Q22 27 20 27 L5 27 Q3 27 3 25 L3 22 Q3 20 5 20 Z', C.vacBody);
  fillRect(ctx, 3, 22, 19, 0.7, C.vacBodyHi, 0, 0.6);
  fillRect(ctx, 3, 26.4, 19, 0.6, C.black);
  for (let i = 0; i < 9; i++) {
    const x = 4 + i * 2;
    fillPath(ctx, `M${x} 26.5 L${x + 0.7} 28 L${x + 1.4} 26.5 Z`, C.black);
  }
  fillCircle(ctx, 13, 11.5, 1.4, C.white);
  fillCircle(ctx, 19, 11.5, 1.4, C.white);
  fillCircle(ctx, 13.3, 11.7, 0.8, C.black);
  fillCircle(ctx, 19.3, 11.7, 0.8, C.black);
  strokePath(ctx, 'M11 9.5 L14.5 10.5', C.vacDark, 1.1, 'round');
  strokePath(ctx, 'M21 9.5 L17.5 10.5', C.vacDark, 1.1, 'round');
  fillCircle(ctx, 16, 14, 0.9, C.vacRed);
}

function drawVacuumHandheld(ctx: Ctx) {
  fillPath(ctx, 'M6 14 L24 14 Q27 14 27 17 L27 20 Q27 22 24 22 L18 22 L18 26 Q18 28 16 28 L13 28 Q11 28 11 26 L11 22 L8 22 Q6 22 6 20 Z', C.salmon);
  strokePath(ctx, 'M6 14 L24 14 Q27 14 27 17 L27 20 Q27 22 24 22 L18 22 L18 26 Q18 28 16 28 L13 28 Q11 28 11 26 L11 22 L8 22 Q6 22 6 20 Z', C.vacDark, 0.5);
  fillRect(ctx, 7, 15, 18, 1.2, '#ffffff', 0.5, 0.35);
  fillRect(ctx, 2, 16, 5, 4, C.vacDark, 0.6);
  fillRect(ctx, 1, 16.5, 2, 3, C.black, 0.3);
  strokePath(ctx, 'M0 18 L1.5 17.5', C.vacChrome, 0.4);
  strokePath(ctx, 'M0 18.5 L1.5 18.5', C.vacChrome, 0.4);
  strokePath(ctx, 'M0 19 L1.5 19.5', C.vacChrome, 0.4);
  fillCircle(ctx, 14, 17.5, 1.4, C.white);
  fillCircle(ctx, 21, 17.5, 1.4, C.white);
  fillCircle(ctx, 13.6, 17.7, 0.8, C.black);
  fillCircle(ctx, 20.6, 17.7, 0.8, C.black);
  strokePath(ctx, 'M12 16 L16 16.5', C.vacDark, 1, 'round');
  strokePath(ctx, 'M23 16 L19 16.5', C.vacDark, 1, 'round');
  fillRect(ctx, 14, 24, 3, 1.2, C.vacDark, 0.5);
  fillCircle(ctx, 15.5, 24.6, 0.4, C.vacRed);
  strokePath(ctx, 'M22 19.5 L25 19.5', C.vacDark, 0.4, 'butt', 0.7);
  strokePath(ctx, 'M22 20.5 L25 20.5', C.vacDark, 0.4, 'butt', 0.7);
}

function drawVacuumScared(ctx: Ctx) {
  // Blue version of Roomba with frightened expression
  fillEllipse(ctx, 16, 29, 11, 1.6, '#ffffff', 0.12);
  fillEllipse(ctx, 16, 22, 12, 6, '#10154a');
  fillEllipse(ctx, 16, 21, 12, 5.5, '#3a5fff');
  fillPath(ctx, 'M5 21 Q5 13 16 13 Q27 13 27 21 Z', '#6a8fff');
  fillPath(ctx, 'M9 22 Q16 26 23 22 L23 24 Q16 27.5 9 24 Z', C.black);
  for (const d of [
    'M11 23 L12 25.5 L13 23 Z', 'M13 23.4 L14 26 L15 23.4 Z',
    'M15 23.6 L16 26.2 L17 23.6 Z', 'M17 23.6 L18 26.2 L19 23.6 Z',
    'M19 23.4 L20 26 L21 23.4 Z',
  ]) { fillPath(ctx, d, C.cream); }
  // Wide scared eyes
  fillCircle(ctx, 12, 17, 1.8, C.white);
  fillCircle(ctx, 20, 17, 1.8, C.white);
  fillCircle(ctx, 12.5, 17.2, 1.1, C.black);
  fillCircle(ctx, 20.5, 17.2, 1.1, C.black);
  // No angry eyebrows — scared ones go upward
  strokePath(ctx, 'M9.5 16 L14 14.5', '#6a8fff', 1.3, 'round');
  strokePath(ctx, 'M22.5 16 L18 14.5', '#6a8fff', 1.3, 'round');
  fillCircle(ctx, 16, 14.5, 0.9, '#444466');
}

// ── Scene ──────────────────────────────────────────────────────────

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const mk = (key: string, draw: (ctx: Ctx) => void) => {
      const ct = this.textures.createCanvas(key, TILE, TILE);
      draw(ct.context);
      ct.refresh();
    };

    mk('wall',           drawWall);
    mk('food',           drawFoodFish);
    mk('food-power',     drawFoodCan);
    mk('cat-mapa',       drawCatMapa);
    mk('cat-lilith',     drawCatLilith);
    mk('vacuum-classic', drawVacuumRoomba);
    mk('vacuum-upright', drawVacuumUpright);
    mk('vacuum-robot',   drawVacuumHandheld);
    mk('vacuum-scared',  drawVacuumScared);
  }

  create() {
    this.scene.start('Game');
    this.scene.launch('HUD');
  }
}
