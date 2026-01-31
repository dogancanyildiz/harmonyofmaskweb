import { Scene } from 'phaser';
import type { Tilemaps } from 'phaser';
import { Player } from '../player/Player';
import { MaskSystem } from '../masks/MaskSystem';
import { MaskType } from '../masks/MaskType';
import type { MaskLayerEntry } from '../masks/MaskSystem';
import { Hotbar } from '../ui/Hotbar';
import {
  SCENE_KEY_GAME,
  SCENE_KEY_WIN,
  SCENE_KEY_MENU,
  SCENE_KEY_SETTINGS,
  LEVEL_MAP_KEYS,
  LEVEL_MIN,
  LEVEL_MAX,
  TILESET_IMAGE_KEY,
  LAYER_NAME_GREEN,
  LAYER_NAME_RED,
  DEATH_FALL_LEVEL_MIN,
  DEATH_FALL_MARGIN,
  VOID_HEIGHT,
  SPAWN_OFFSET_X,
  SPAWN_OFFSET_Y,
  GOAL_ZONE_WIDTH,
  GOAL_ZONE_HEIGHT,
  GOAL_ZONE_OFFSET_RIGHT,
  GOAL_ZONE_OFFSET_BOTTOM,
  GOAL_COLOR_NORMAL,
  GOAL_COLOR_FINAL,
  GOAL_ALPHA,
  CAMERA_FOLLOW_LERP,
  LAYER_TINT_RED,
  LAYER_TINT_GREEN,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';
import { saveLastCompletedLevel } from '../save';
import { SoundManager } from '../audio/SoundManager';

/**
 * Main game scene: multiple levels, goal zone to advance, death by fall from level 3+.
 */
export class GameScene extends Scene {
  private player!: Player;
  private maskSystem!: MaskSystem;
  private hotbar!: Hotbar;
  private currentLevel = LEVEL_MIN;
  private mapHeightPx = 0;
  private mapWidthPx = 0;
  private goalZone: Phaser.Geom.Rectangle | null = null;
  private goalGraphics: Phaser.GameObjects.Graphics | null = null;
  private isPaused = false;
  private pauseOverlay: Phaser.GameObjects.Container | null = null;
  private keyEsc!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyM!: Phaser.Input.Keyboard.Key;
  private soundManager!: SoundManager;

  constructor() {
    super({ key: SCENE_KEY_GAME });
  }

  preload(): void {
    this.load.setBaseURL('/assets/');
    this.load.image(TILESET_IMAGE_KEY, 'tileset.png');
    for (const mapKey of Object.values(LEVEL_MAP_KEYS)) {
      this.load.tilemapTiledJSON(mapKey, `${mapKey}.json`);
    }
  }

  create(data?: { level?: number }): void {
    this.currentLevel = Phaser.Math.Clamp(data?.level ?? LEVEL_MIN, LEVEL_MIN, LEVEL_MAX);
    const mapKey = LEVEL_MAP_KEYS[this.currentLevel];

    this.cameras.main.setRoundPixels(true);

    const { map, greenLayer, redLayer } = this.setupMap(mapKey);
    if (!greenLayer || !redLayer) return;

    this.mapWidthPx = map.widthInPixels;
    this.mapHeightPx = map.heightInPixels;

    this.setupWorldBounds();
    this.soundManager = new SoundManager();
    this.player = new Player(this, SPAWN_OFFSET_X, this.mapHeightPx - SPAWN_OFFSET_Y, () =>
      this.soundManager.playJump()
    );
    this.setupColliders(greenLayer, redLayer);
    this.maskSystem = new MaskSystem(
      [
        { maskType: MaskType.Red, layer: redLayer },
        { maskType: MaskType.Green, layer: greenLayer },
      ],
      MaskType.Red
    );
    this.setupHotbar();
    this.setupCamera();
    this.setupGoalZone();
    this.setupLevelIndicator();
    this.setupPauseOverlay();
    this.setupPauseKeys();
  }

  private setupPauseOverlay(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const bg = this.add.graphics();
    bg.fillStyle(0x0, 0.7);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const title = this.add.text(cx, cy - 30, 'Duraklatıldı', {
      fontSize: '18px',
      color: '#fbbf24',
    }).setOrigin(0.5);
    const devam = this.add.text(cx, cy, 'Devam: Esc', {
      fontSize: '14px',
      color: '#e2e8f0',
    }).setOrigin(0.5);
    const ayarlar = this.add.text(cx, cy + 24, 'Ayarlar: A', {
      fontSize: '14px',
      color: '#e2e8f0',
    }).setOrigin(0.5);
    const menu = this.add.text(cx, cy + 48, 'Menüye dön: M', {
      fontSize: '14px',
      color: '#e2e8f0',
    }).setOrigin(0.5);
    this.pauseOverlay = this.add.container(0, 0, [bg, title, devam, ayarlar, menu]);
    this.pauseOverlay.setVisible(false);
    this.pauseOverlay.setDepth(2000);
  }

  private setupPauseKeys(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    this.keyEsc = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keyA = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyM = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  private setupMap(mapKey: string): {
    map: Phaser.Tilemaps.Tilemap;
    greenLayer: Tilemaps.TilemapLayer | null;
    redLayer: Tilemaps.TilemapLayer | null;
  } {
    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage(TILESET_IMAGE_KEY, TILESET_IMAGE_KEY);
    if (!tileset) {
      console.error('Tileset not found');
      return { map, greenLayer: null, redLayer: null };
    }

    const greenLayer = map.createLayer(LAYER_NAME_GREEN, tileset, 0, 0);
    const redLayer = map.createLayer(LAYER_NAME_RED, tileset, 0, 0);
    if (!greenLayer || !redLayer) {
      console.error('Layers green/red not found');
      return { map, greenLayer: null, redLayer: null };
    }

    greenLayer.setCollisionByExclusion([-1]);
    redLayer.setCollisionByExclusion([-1]);
    redLayer.setTint(LAYER_TINT_RED);
    greenLayer.setTint(LAYER_TINT_GREEN);

    return { map, greenLayer, redLayer };
  }

  private setupWorldBounds(): void {
    const worldHeight =
      this.currentLevel >= DEATH_FALL_LEVEL_MIN
        ? this.mapHeightPx + VOID_HEIGHT
        : this.mapHeightPx;
    this.physics.world.setBounds(0, 0, this.mapWidthPx, worldHeight);
  }

  private setupColliders(
    greenLayer: Tilemaps.TilemapLayer,
    redLayer: Tilemaps.TilemapLayer
  ): void {
    const physics = this.physics as Phaser.Physics.Arcade.ArcadePhysics;
    const go = this.player.getGameObject();
    physics.add.collider(go, greenLayer);
    physics.add.collider(go, redLayer);
  }

  private setupHotbar(): void {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.hotbar = new Hotbar(this, gameWidth, gameHeight, (_, maskType) => {
      if (maskType !== null) this.maskSystem.setActiveMask(maskType);
    });
    this.hotbar.setSelectedSlot(0);
  }

  private setupCamera(): void {
    this.cameras.main.setBounds(0, 0, this.mapWidthPx, this.mapHeightPx);
    this.cameras.main.startFollow(
      this.player.getGameObject(),
      true,
      CAMERA_FOLLOW_LERP,
      CAMERA_FOLLOW_LERP
    );
  }

  private setupGoalZone(): void {
    this.goalZone = new Phaser.Geom.Rectangle(
      this.mapWidthPx - GOAL_ZONE_OFFSET_RIGHT,
      this.mapHeightPx - GOAL_ZONE_OFFSET_BOTTOM,
      GOAL_ZONE_WIDTH,
      GOAL_ZONE_HEIGHT
    );
    this.goalGraphics = this.add.graphics();
    const color = this.currentLevel === LEVEL_MAX ? GOAL_COLOR_FINAL : GOAL_COLOR_NORMAL;
    this.goalGraphics.fillStyle(color, GOAL_ALPHA);
    this.goalGraphics.fillRect(
      this.goalZone.x,
      this.goalZone.y,
      this.goalZone.width,
      this.goalZone.height
    );
  }

  private setupLevelIndicator(): void {
    const text = this.add.text(8, 8, `Bölüm ${this.currentLevel} / ${LEVEL_MAX}`, {
      fontSize: '12px',
      color: '#e2e8f0',
    });
    text.setScrollFactor(0);
    text.setDepth(1000);
  }

  update(): void {
    if (this.isPaused) {
      if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
        this.isPaused = false;
        this.pauseOverlay?.setVisible(false);
      } else if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
        this.scene.start(SCENE_KEY_SETTINGS);
      } else if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
        this.scene.start(SCENE_KEY_MENU);
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.isPaused = true;
      this.pauseOverlay?.setVisible(true);
      return;
    }

    this.player.update();
    const body = this.player.getBody();

    if (this.checkDeathByFall(body)) {
      this.soundManager.playDeath();
      this.scene.start(SCENE_KEY_GAME, { level: this.currentLevel });
      return;
    }

    if (this.checkGoalReached(body)) {
      this.soundManager.playGoal();
      saveLastCompletedLevel(this.currentLevel);
      if (this.currentLevel === LEVEL_MAX) {
        this.scene.start(SCENE_KEY_WIN);
      } else {
        this.scene.start(SCENE_KEY_GAME, { level: this.currentLevel + 1 });
      }
      return;
    }
  }

  private checkDeathByFall(body: Phaser.Physics.Arcade.Body): boolean {
    if (this.currentLevel < DEATH_FALL_LEVEL_MIN) return false;
    const playerBottom = body.y + body.height;
    return playerBottom > this.mapHeightPx + DEATH_FALL_MARGIN;
  }

  private checkGoalReached(body: Phaser.Physics.Arcade.Body): boolean {
    if (!this.goalZone) return false;
    const playerRect = new Phaser.Geom.Rectangle(
      body.x,
      body.y,
      body.width,
      body.height
    );
    return Phaser.Geom.Rectangle.Overlaps(playerRect, this.goalZone);
  }
}
