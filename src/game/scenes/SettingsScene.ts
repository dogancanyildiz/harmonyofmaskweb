import { Scene } from 'phaser';
import {
  SCENE_KEY_MENU,
  SCENE_KEY_SETTINGS,
  SCENE_KEY_CONTROLS,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';

/**
 * Settings screen (placeholder). Kontroller, Back: Escape.
 */
export class SettingsScene extends Scene {
  constructor() {
    super({ key: SCENE_KEY_SETTINGS });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add
      .text(cx, cy - 40, 'Ayarlar', {
        fontSize: '20px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy - 10, 'Kontroller [K]', {
        fontSize: '14px',
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy + 30, 'Bu ekran ileride genişletilecek.', {
        fontSize: '12px',
        color: '#64748b',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy + 60, 'Geri: Escape', {
        fontSize: '12px',
        color: '#64748b',
      })
      .setOrigin(0.5);

    const keyboard = this.input.keyboard;
    if (keyboard) {
      const keyEsc = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      const keyK = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
      keyEsc?.on('down', () => this.scene.start(SCENE_KEY_MENU));
      keyK?.on('down', () => this.scene.start(SCENE_KEY_CONTROLS, { returnTo: SCENE_KEY_SETTINGS }));
    }
  }
}
