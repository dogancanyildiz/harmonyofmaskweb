import { Scene } from 'phaser';
import { SCENE_KEY_GAME, SCENE_KEY_MENU, SCENE_KEY_WIN, LEVEL_MIN, GAME_WIDTH, GAME_HEIGHT } from '../constants';

/**
 * Win / congratulations screen after completing the final level.
 * Space or click: play again (level 1). Escape: main menu.
 */
export class WinScene extends Scene {
  constructor() {
    super({ key: SCENE_KEY_WIN });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add
      .text(cx, cy - 20, 'Tebrikler!', {
        fontSize: '24px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy + 10, 'Oyunu tamamladın.', {
        fontSize: '14px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy + 40, 'Tekrar oyna: Space', {
        fontSize: '12px',
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy + 58, 'Menü: Escape', {
        fontSize: '12px',
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    const keySpace = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const keyEsc = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    keySpace?.once('down', () => this.scene.start(SCENE_KEY_GAME, { level: LEVEL_MIN }));
    keyEsc?.once('down', () => this.scene.start(SCENE_KEY_MENU));
    this.input.once('pointerdown', () => {
      this.scene.start(SCENE_KEY_GAME, { level: LEVEL_MIN });
    });
  }
}
