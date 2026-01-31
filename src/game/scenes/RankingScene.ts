import { Scene } from 'phaser';
import { SCENE_KEY_MENU, SCENE_KEY_RANKING, GAME_WIDTH, GAME_HEIGHT, LEVEL_MAX } from '../constants';
import { getLastCompletedLevel } from '../save';

/**
 * Ranking / progress screen. Shows highest level completed. Back: Escape.
 */
export class RankingScene extends Scene {
  constructor() {
    super({ key: SCENE_KEY_RANKING });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const maxLevel = getLastCompletedLevel();

    this.add
      .text(cx, cy - 40, 'Sıralama', {
        fontSize: '20px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    const status =
      maxLevel >= LEVEL_MAX
        ? 'Tüm bölümleri tamamladın!'
        : maxLevel > 0
          ? `En yüksek bölüm: ${maxLevel} / ${LEVEL_MAX}`
          : 'Henüz kayıt yok. Oyna ve bölümleri tamamla.';

    this.add
      .text(cx, cy, status, {
        fontSize: '14px',
        color: '#e2e8f0',
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, cy + 50, 'Geri: Escape', {
        fontSize: '12px',
        color: '#64748b',
      })
      .setOrigin(0.5);

    const keyEsc = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    keyEsc?.once('down', () => this.scene.start(SCENE_KEY_MENU));
  }
}
