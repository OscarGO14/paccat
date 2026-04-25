import Phaser from 'phaser';
import { TILE, MAZE_COLS, MAZE_ROWS, COLORS } from './config';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HUDScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: COLORS.bg,
  width: MAZE_COLS * TILE,
  height: MAZE_ROWS * TILE,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene, HUDScene],
};

new Phaser.Game(config);
