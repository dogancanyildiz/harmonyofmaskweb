import { Scene } from 'phaser';
import {
  SCENE_KEY_MENU,
  SCENE_KEY_SETTINGS,
  SCENE_KEY_CONTROLS,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';
import { getVolumePrefs, setVolumePrefs, type VolumePrefs } from '../save';

const MASTER_LABELS = ['Yüksek', 'Orta', 'Düşük', 'Kapalı'] as const;
const MASTER_VALUES = [1, 0.66, 0.33, 0] as const;

/**
 * Settings: Kontroller, Ses (master), Müzik (açık/kapalı). Geri: Escape.
 */
export class SettingsScene extends Scene {
  private masterIndex = 0;
  private musicOn = true;
  private masterText: Phaser.GameObjects.Text | null = null;
  private musicText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: SCENE_KEY_SETTINGS });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const vol = getVolumePrefs();
    this.masterIndex = MASTER_VALUES.reduce((best, v, i) => (Math.abs(v - vol.master) < Math.abs(MASTER_VALUES[best] - vol.master) ? i : best), 0);
    this.musicOn = vol.music > 0;

    this.add
      .text(cx, 28, 'Ayarlar', {
        fontSize: '20px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 58, 'Kontroller [K]', {
        fontSize: '14px',
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.masterText = this.add
      .text(cx, 88, `Ses: ${MASTER_LABELS[this.masterIndex]}`, {
        fontSize: '14px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5);

    this.musicText = this.add
      .text(cx, 112, `Müzik: ${this.musicOn ? 'Açık' : 'Kapalı'}`, {
        fontSize: '14px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 148, 'Sol/Sağ: Ses  M: Müzik  Geri: Escape', {
        fontSize: '10px',
        color: '#64748b',
      })
      .setOrigin(0.5);

    this.saveAndApply();
    this.setupKeys();
  }

  private saveAndApply(): void {
    const prefs: VolumePrefs = {
      master: MASTER_VALUES[this.masterIndex],
      music: this.musicOn ? 0.6 : 0,
    };
    setVolumePrefs(prefs);
    if (this.masterText) this.masterText.setText(`Ses: ${MASTER_LABELS[this.masterIndex]}`);
    if (this.musicText) this.musicText.setText(`Müzik: ${this.musicOn ? 'Açık' : 'Kapalı'}`);
  }

  private setupKeys(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    const left = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    const right = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const m = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    const keyEsc = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const keyK = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

    left.on('down', () => {
      this.masterIndex = (this.masterIndex + 1) % MASTER_LABELS.length;
      this.saveAndApply();
    });
    right.on('down', () => {
      this.masterIndex = (this.masterIndex - 1 + MASTER_LABELS.length) % MASTER_LABELS.length;
      this.saveAndApply();
    });
    m.on('down', () => {
      this.musicOn = !this.musicOn;
      this.saveAndApply();
    });
    keyEsc?.on('down', () => this.scene.start(SCENE_KEY_MENU));
    keyK?.on('down', () => this.scene.start(SCENE_KEY_CONTROLS, { returnTo: SCENE_KEY_SETTINGS }));
  }
}
