import Phaser from 'phaser';
export class HUDScene extends Phaser.Scene {
    constructor() { super({ key: 'HUD', active: false }); }
    create() {
        this.scoreText = this.add.text(8, 6, '', {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#f4d06f',
        }).setScrollFactor(0).setDepth(1000);
        this.refresh();
        const game = this.scene.get('Game');
        game.events.on('hud:update', this.refresh, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            game.events.off('hud:update', this.refresh, this);
        });
    }
    refresh() {
        const score = this.registry.get('score') ?? 0;
        const lives = this.registry.get('lives') ?? 3;
        this.scoreText.setText(`Score: ${score}    Lives: ${lives}`);
    }
}
