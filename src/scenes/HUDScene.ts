import Phaser from 'phaser';

export class HUDScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'HUD', active: false }); }

  create() {
    this.scoreText = this.add.text(10, 7, '', {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#ffe6c4',
    }).setScrollFactor(0).setDepth(1000);

    this.livesText = this.add.text(10, 26, '', {
      fontFamily: "'Fredoka', system-ui, sans-serif",
      fontSize: '14px',
      color: '#7cf5c8',
    }).setScrollFactor(0).setDepth(1000);

    this.refresh();
    const game = this.scene.get('Game');
    game.events.on('hud:update', this.refresh, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off('hud:update', this.refresh, this);
    });
  }

  private refresh() {
    const score = (this.registry.get('score') as number) ?? 0;
    const lives = (this.registry.get('lives') as number) ?? 3;
    this.scoreText.setText(`Score  ${score}`);
    this.livesText.setText('♥ '.repeat(lives).trim());
  }
}
