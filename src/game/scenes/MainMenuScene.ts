import { Scene } from 'phaser';
import {
  SCENE_KEY_GAME,
  SCENE_KEY_MENU,
  SCENE_KEY_SETTINGS,
  SCENE_KEY_RANKING,
  SCENE_KEY_LEVEL_SELECT,
  SCENE_KEY_CONTROLS,
  LEVEL_MIN,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';
import { getLastCompletedLevel } from '../save';

const MENU_OPTIONS = [
  'new',      // Yeni oyun
  'continue', // Devam et
  'levels',   // Seviye seç
  'ranking',  // Sıralama
  'controls', // Kontroller
  'settings', // Ayarlar
] as const;

type MenuOption = (typeof MENU_OPTIONS)[number];

/**
 * Main menu: title and selectable options (Yeni oyun, Devam et, Sıralama, Ayarlar).
 * Arrow keys or W/S: move. Enter or Space: confirm.
 */
export class MainMenuScene extends Scene {
  private selectedIndex = 0;
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private maxLevel = 0;

  constructor() {
    super({ key: SCENE_KEY_MENU });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.maxLevel = getLastCompletedLevel();

    this.add
      .text(cx, 36, 'Harmony of Mask', {
        fontSize: '20px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    const labels: Record<MenuOption, string> = {
      new: 'Yeni oyun',
      continue: this.maxLevel > 0 ? `Devam et (Bölüm ${this.maxLevel + 1})` : 'Devam et (kayıt yok)',
      levels: 'Seviye seç',
      ranking: 'Sıralama',
      controls: 'Kontroller',
      settings: 'Ayarlar',
    };

    const startY = 80;
    const lineHeight = 22;

    MENU_OPTIONS.forEach((key, i) => {
      const y = startY + i * lineHeight;
      const label = labels[key];
      const text = this.add.text(cx, y, label, {
        fontSize: '14px',
        color: i === this.selectedIndex ? '#fbbf24' : '#94a3b8',
      });
      text.setOrigin(0.5);
      this.optionTexts.push(text);
    });

    this.add
      .text(cx, GAME_HEIGHT - 16, 'Yukarı/Aşağı veya W/S — Enter veya Space', {
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

    up.on('down', () => this.moveSelection(-1));
    down.on('down', () => this.moveSelection(1));
    w.on('down', () => this.moveSelection(-1));
    s.on('down', () => this.moveSelection(1));
    enter.on('down', () => this.confirm());
    space.on('down', () => this.confirm());
  }

  private moveSelection(delta: number): void {
    this.selectedIndex = Phaser.Math.Wrap(this.selectedIndex + delta, 0, MENU_OPTIONS.length);
    this.optionTexts.forEach((text, i) => {
      text.setColor(i === this.selectedIndex ? '#fbbf24' : '#94a3b8');
    });
  }

  private confirm(): void {
    const option = MENU_OPTIONS[this.selectedIndex];
    switch (option) {
      case 'new':
        this.scene.start(SCENE_KEY_GAME, { level: LEVEL_MIN });
        break;
      case 'continue':
        if (this.maxLevel > 0) {
          const nextLevel = Math.min(this.maxLevel + 1, 5);
          this.scene.start(SCENE_KEY_GAME, { level: nextLevel });
        }
        break;
      case 'levels':
        this.scene.start(SCENE_KEY_LEVEL_SELECT);
        break;
      case 'ranking':
        this.scene.start(SCENE_KEY_RANKING);
        break;
      case 'controls':
        this.scene.start(SCENE_KEY_CONTROLS);
        break;
      case 'settings':
        this.scene.start(SCENE_KEY_SETTINGS);
        break;
    }
  }
}
