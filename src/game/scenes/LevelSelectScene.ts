import { Scene } from 'phaser';
import {
  SCENE_KEY_GAME,
  SCENE_KEY_MENU,
  SCENE_KEY_LEVEL_SELECT,
  LEVEL_MIN,
  LEVEL_MAX,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';
import { getLastCompletedLevel } from '../save';

/**
 * Level select: choose level 1–5. Only unlocked levels (by save) are selectable.
 * Arrow/W/S: move. Enter/Space: start level. Escape: main menu.
 */
export class LevelSelectScene extends Scene {
  private selectedIndex = 0;
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private unlockedThrough: number;

  constructor() {
    super({ key: SCENE_KEY_LEVEL_SELECT });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.unlockedThrough = Math.min(getLastCompletedLevel() + 1, LEVEL_MAX);

    this.add
      .text(cx, 32, 'Seviye seç', {
        fontSize: '18px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    const startY = 70;
    const lineHeight = 24;

    for (let level = LEVEL_MIN; level <= LEVEL_MAX; level++) {
      const i = level - LEVEL_MIN;
      const y = startY + i * lineHeight;
      const unlocked = level <= this.unlockedThrough;
      const label = unlocked ? `Bölüm ${level}` : `Bölüm ${level} (kilitli)`;
      const text = this.add.text(cx, y, label, {
        fontSize: '14px',
        color: unlocked ? (i === 0 ? '#fbbf24' : '#94a3b8') : '#475569',
      });
      text.setOrigin(0.5);
      this.optionTexts.push(text);
    }

    this.add
      .text(cx, GAME_HEIGHT - 20, 'Enter/Space: Başla — Escape: Menü', {
        fontSize: '10px',
        color: '#64748b',
      })
      .setOrigin(0.5);

    this.setupKeys();
  }

  private setupKeys(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;

    const up = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const down = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const w = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const s = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const enter = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const esc = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    up.on('down', () => this.moveSelection(-1));
    down.on('down', () => this.moveSelection(1));
    w.on('down', () => this.moveSelection(-1));
    s.on('down', () => this.moveSelection(1));
    enter.on('down', () => this.confirm());
    space.on('down', () => this.confirm());
    esc.once('down', () => this.scene.start(SCENE_KEY_MENU));
  }

  private moveSelection(delta: number): void {
    this.selectedIndex = Phaser.Math.Wrap(
      this.selectedIndex + delta,
      0,
      LEVEL_MAX - LEVEL_MIN + 1
    );
    this.optionTexts.forEach((text, i) => {
      const level = LEVEL_MIN + i;
      const unlocked = level <= this.unlockedThrough;
      text.setColor(unlocked ? (i === this.selectedIndex ? '#fbbf24' : '#94a3b8') : '#475569');
    });
  }

  private confirm(): void {
    const level = LEVEL_MIN + this.selectedIndex;
    if (level <= this.unlockedThrough) {
      this.scene.start(SCENE_KEY_GAME, { level });
    }
  }
}
