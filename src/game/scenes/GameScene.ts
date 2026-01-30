import { Scene } from 'phaser';
import { Player } from '../player/Player';
import { MaskSystem } from '../masks/MaskSystem';
import { MaskType } from '../masks/MaskType';
import type { MaskLayerEntry } from '../masks/MaskSystem';
import { Hotbar } from '../ui/Hotbar';

const LEVEL_MAP_KEYS: Record<number, string> = {
  1: 'tilemap',
  2: 'tilemap2',
  3: 'tilemap3',
  4: 'tilemap4',
  5: 'tilemap5',
};

/** Bölüm 3’ten itibaren boşluğa düşme = ölüm (bölüm yeniden). */
const DEATH_FALL_LEVEL_MIN = 3;
/** Harita altına bu kadar düşünce ölüm. */
const DEATH_FALL_MARGIN = 32;
/** Bölüm 3+ için dünya altı boşluk (oyuncu düşebilsin diye). */
const VOID_HEIGHT = 200;

/**
 * Game scene: 5 bölüm. Hedefle sonraki bölüme geçiş; bölüm 3+ düşme = ölüm.
 */
export class GameScene extends Scene {
  private player!: Player;
  private maskSystem!: MaskSystem;
  private hotbar!: Hotbar;
  private currentLevel = 1;
  private mapHeightPx = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    this.load.setBaseURL('/assets/');
    this.load.image('tileset', 'tileset.png');
    this.load.tilemapTiledJSON('tilemap', 'tilemap.json');
    this.load.tilemapTiledJSON('tilemap2', 'tilemap2.json');
    this.load.tilemapTiledJSON('tilemap3', 'tilemap3.json');
    this.load.tilemapTiledJSON('tilemap4', 'tilemap4.json');
    this.load.tilemapTiledJSON('tilemap5', 'tilemap5.json');
  }

  create(data?: { level?: number }): void {
    this.currentLevel = Math.min(5, Math.max(1, data?.level ?? 1));
    const mapKey = LEVEL_MAP_KEYS[this.currentLevel];

    this.cameras.main.setRoundPixels(true);

    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage('tileset', 'tileset');
    if (!tileset) {
      console.error('Tileset not found');
      return;
    }

    const greenLayer = map.createLayer('green', tileset, 0, 0);
    const redLayer = map.createLayer('red', tileset, 0, 0);
    if (!greenLayer || !redLayer) {
      console.error('Layers green/red not found');
      return;
    }

    greenLayer.setCollisionByExclusion([-1]);
    redLayer.setCollisionByExclusion([-1]);

    // Katman renkleri: kırmızı ve yeşil (tileset beyaz, tint ile renk veriyoruz)
    redLayer.setTint(0xef4444);
    greenLayer.setTint(0x22c55e);

    const mapWidthPx = map.widthInPixels;
    this.mapHeightPx = map.heightInPixels;
    const worldHeight =
      this.currentLevel >= DEATH_FALL_LEVEL_MIN
        ? this.mapHeightPx + VOID_HEIGHT
        : this.mapHeightPx;
    this.physics.world.setBounds(0, 0, mapWidthPx, worldHeight);

    this.player = new Player(this, 48, this.mapHeightPx - 48);

    const physics = this.physics as Phaser.Physics.Arcade.ArcadePhysics;
    physics.add.collider(this.player.getGameObject(), greenLayer);
    physics.add.collider(this.player.getGameObject(), redLayer);

    // 1. engel = kırmızı, 1. maske = kırmızı (varsayılan)
    const entries: MaskLayerEntry[] = [
      { maskType: MaskType.Red, layer: redLayer },
      { maskType: MaskType.Green, layer: greenLayer },
    ];
    this.maskSystem = new MaskSystem(entries, MaskType.Red);

    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.hotbar = new Hotbar(this, gameWidth, gameHeight, (slotIndex, maskType) => {
      if (maskType !== null) this.maskSystem.setActiveMask(maskType);
    });
    this.hotbar.setSelectedSlot(0);

    this.cameras.main.setBounds(0, 0, mapWidthPx, this.mapHeightPx);
    this.cameras.main.startFollow(this.player.getGameObject(), true, 0.1, 0.1);

    const hasGoal = this.currentLevel >= 1 && this.currentLevel <= 5;
    if (hasGoal) {
      this.goalZone = new Phaser.Geom.Rectangle(mapWidthPx - 32, this.mapHeightPx - 80, 40, 80);
      this.goalGraphics = this.add.graphics();
      this.goalGraphics.fillStyle(this.currentLevel === 5 ? 0xfbbf24 : 0x22c55e, 0.35);
      this.goalGraphics.fillRect(this.goalZone.x, this.goalZone.y, this.goalZone.width, this.goalZone.height);
    } else {
      this.goalZone = null;
      this.goalGraphics = null;
    }
  }

  private goalZone: Phaser.Geom.Rectangle | null = null;
  private goalGraphics: Phaser.GameObjects.Graphics | null = null;

  update(): void {
    this.player.update();

    const body = this.player.getBody();

    const playerBottom = body.y + body.height;
    if (
      this.currentLevel >= DEATH_FALL_LEVEL_MIN &&
      playerBottom > this.mapHeightPx + DEATH_FALL_MARGIN
    ) {
      this.scene.start('GameScene', { level: this.currentLevel });
      return;
    }

    if (this.goalZone) {
      const playerRect = new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
      if (Phaser.Geom.Rectangle.Overlaps(playerRect, this.goalZone)) {
        if (this.currentLevel < 5) {
          this.scene.start('GameScene', { level: this.currentLevel + 1 });
        } else {
          this.scene.start('GameScene', { level: 1 });
        }
      }
    }
  }
}
