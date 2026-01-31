import { Scene } from 'phaser';
import {
  SCENE_KEY_CONTROLS,
  SCENE_KEY_MENU,
  SCENE_KEY_SETTINGS,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';

const CONTROLS: { keys: string; action: string }[] = [
  { keys: 'A / D', action: 'Sola / Sağa hareket' },
  { keys: 'W / Space', action: 'Zıpla' },
  { keys: 'S', action: 'Eğil' },
  { keys: '1 – 5', action: 'Maske slotu seç (hotbar)' },
  { keys: 'Esc', action: 'Duraklat (oyun içi)' },
];

/**
 * Controls screen. Shows keyboard layout (A/D, W/Space, S, 1–5). Back: Escape.
 */
export class ControlsScene extends Scene {
  constructor() {
    super({ key: SCENE_KEY_CONTROLS });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;

    this.add
      .text(cx, 28, 'Kontroller', {
        fontSize: '20px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    const startY = 64;
    const lineHeight = 20;

    CONTROLS.forEach((row, i) => {
      const y = startY + i * lineHeight;
      this.add
        .text(cx - 50, y, row.keys, {
          fontSize: '12px',
          color: '#fbbf24',
        })
        .setOrigin(1, 0.5);
      this.add
        .text(cx - 46, y, row.action, {
          fontSize: '12px',
          color: '#94a3b8',
        })
        .setOrigin(0, 0.5);
    });

    this.add
      .text(cx, GAME_HEIGHT - 20, 'Geri: Escape', {
        fontSize: '10px',
        color: '#64748b',
      })
      .setOrigin(0.5);

    const returnTo = this.data.get('returnTo') as string | undefined;
    const keyEsc = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    keyEsc?.once('down', () => {
      this.scene.start(returnTo === SCENE_KEY_SETTINGS ? SCENE_KEY_SETTINGS : SCENE_KEY_MENU);
    });
  }

  init(data: { returnTo?: string }): void {
    if (data?.returnTo) {
      this.data.set('returnTo', data.returnTo);
    }
  }
}
