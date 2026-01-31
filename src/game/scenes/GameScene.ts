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
  TILE_SIZE,
  LAYER_NAME_GREEN,
  LAYER_NAME_RED,
  LAYER_NAME_BLUE,
  DEATH_FALL_LEVEL_MIN,
  DEATH_FALL_MARGIN,
  VOID_HEIGHT,
  SPAWN_OFFSET_X,
  SPAWN_OFFSET_Y,
  PLAYER_STAND_HEIGHT,
  CHECKPOINT_TRIGGER_RATIO,
  LIVES_MAX,
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
  LAYER_TINT_BLUE,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';
import { saveLastCompletedLevel, getVolumePrefs } from '../save';
import { SoundManager } from '../audio/SoundManager';
import { spawnGoalEffect, spawnDeathEffect, spawnJumpDust } from '../effects/ParticleEffects';

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
  private isTransitioning = false;
  private previousMaskType: MaskType | null = MaskType.Red;
  private checkpointX = 0;
  private checkpointY = 0;
  private checkpointTriggered = false;
  private lives = LIVES_MAX;
  private hazardGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
  private livesContainer: Phaser.GameObjects.Container | null = null;

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

  create(data?: { level?: number; spawnX?: number; spawnY?: number; lives?: number }): void {
    this.currentLevel = Phaser.Math.Clamp(data?.level ?? LEVEL_MIN, LEVEL_MIN, LEVEL_MAX);
    const mapKey = LEVEL_MAP_KEYS[this.currentLevel];

    this.isPaused = false;
    this.isTransitioning = false;
    this.input.enabled = true;
    if (this.input.keyboard) this.input.keyboard.enabled = true;

    this.cameras.main.setRoundPixels(true);

    const { map, greenLayer, redLayer, blueLayer } = this.setupMap(mapKey);
    if (!greenLayer || !redLayer) return;

    this.mapWidthPx = map.widthInPixels;
    this.mapHeightPx = map.heightInPixels;

    this.lives = data?.lives ?? LIVES_MAX;
    const groundY = this.mapHeightPx - TILE_SIZE - PLAYER_STAND_HEIGHT / 2;
    this.checkpointX = data?.spawnX ?? SPAWN_OFFSET_X;
    this.checkpointY = data?.spawnY ?? groundY;
    this.checkpointTriggered = data?.spawnX != null;

    this.setupWorldBounds();
    this.soundManager = new SoundManager();
    const vol = getVolumePrefs();
    this.soundManager.setMasterVolume(vol.master);
    this.soundManager.setMusicVolume(vol.music);
    if (vol.music > 0) this.soundManager.startMusic();
    this.player = new Player(this, this.checkpointX, this.checkpointY, () => {
      this.soundManager.playJump();
      const body = this.player.getBody();
      const fx = body.x + body.width / 2;
      const fy = body.y + body.height;
      spawnJumpDust(this, fx, fy);
    });
    this.setupColliders(greenLayer, redLayer, blueLayer);
    const maskEntries: MaskLayerEntry[] = [
      { maskType: MaskType.Red, layer: redLayer },
      { maskType: MaskType.Green, layer: greenLayer },
    ];
    if (blueLayer) maskEntries.push({ maskType: MaskType.Blue, layer: blueLayer });
    this.maskSystem = new MaskSystem(maskEntries, MaskType.Red);
    this.setupHotbar();
    this.previousMaskType = MaskType.Red;
    this.setupCamera();
    this.setupGoalZone();
    this.setupLevelIndicator();
    this.setupHazards(map);
    this.setupLivesHUD();
    if (this.hazardGroup) {
      const physics = this.physics as Phaser.Physics.Arcade.ArcadePhysics;
      physics.add.overlap(this.player.getGameObject(), this.hazardGroup, () => this.triggerDeath());
    }
    this.setupPauseOverlay();
    this.setupPauseKeys();
    this.time.delayedCall(0, () => this.focusCanvas());
  }

  /** Ensure canvas has focus so keyboard works after scene restart (e.g. level 1 → 2). */
  private focusCanvas(): void {
    const canvas = this.game.canvas;
    if (canvas && typeof canvas.focus === 'function') {
      if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '1');
      canvas.focus();
    }
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
    blueLayer: Tilemaps.TilemapLayer | null;
  } {
    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage(TILESET_IMAGE_KEY, TILESET_IMAGE_KEY);
    if (!tileset) {
      console.error('Tileset not found');
      return { map, greenLayer: null, redLayer: null, blueLayer: null };
    }

    const greenLayer = map.createLayer(LAYER_NAME_GREEN, tileset, 0, 0);
    const redLayer = map.createLayer(LAYER_NAME_RED, tileset, 0, 0);
    const blueLayer = map.createLayer(LAYER_NAME_BLUE, tileset, 0, 0);
    if (!greenLayer || !redLayer) {
      console.error('Layers green/red not found');
      return { map, greenLayer: null, redLayer: null, blueLayer: null };
    }

    greenLayer.setCollisionByExclusion([-1]);
    redLayer.setCollisionByExclusion([-1]);
    redLayer.setTint(LAYER_TINT_RED);
    greenLayer.setTint(LAYER_TINT_GREEN);
    if (blueLayer) {
      blueLayer.setCollisionByExclusion([-1]);
      blueLayer.setTint(LAYER_TINT_BLUE);
    }

    return { map, greenLayer, redLayer, blueLayer };
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
    redLayer: Tilemaps.TilemapLayer,
    blueLayer: Tilemaps.TilemapLayer | null
  ): void {
    const physics = this.physics as Phaser.Physics.Arcade.ArcadePhysics;
    const go = this.player.getGameObject();
    physics.add.collider(go, greenLayer);
    physics.add.collider(go, redLayer);
    if (blueLayer) physics.add.collider(go, blueLayer);
  }

  private setupHotbar(): void {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.hotbar = new Hotbar(this, gameWidth, gameHeight, (_, maskType) => {
      if (maskType !== null) {
        this.maskSystem.setActiveMask(maskType);
        if (maskType !== this.previousMaskType) {
          this.soundManager.playMaskSwitch();
          this.previousMaskType = maskType;
        }
      }
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

  private setupHazards(map: Phaser.Tilemaps.Tilemap): void {
    this.hazardGroup = this.physics.add.staticGroup();
    const layers = (map as unknown as { layers?: { name: string; type?: string; objects?: { x: number; y: number; width?: number; height?: number }[] }[] }).layers;
    const layer = map.getObjectLayer?.('hazards') ?? layers?.find((l) => l.name === 'hazards' && l.objects);
    const objects = layer?.objects;
    if (objects?.length) {
      for (const obj of objects) {
        const w = obj.width ?? TILE_SIZE;
        const h = obj.height ?? TILE_SIZE;
        const rect = this.add.rectangle((obj.x ?? 0) + w / 2, (obj.y ?? 0) + h / 2, w, h, 0xef4444, 0.5);
        (this.physics as Phaser.Physics.Arcade.ArcadePhysics).add.existing(rect, true);
        this.hazardGroup.add(rect);
      }
    }
  }

  private setupLivesHUD(): void {
    const heartSize = 10;
    const gap = 4;
    const startX = 8;
    const startY = 24;
    this.livesContainer = this.add.container(0, 0);
    this.livesContainer.setDepth(1000);
    for (let i = 0; i < LIVES_MAX; i++) {
      const x = startX + i * (heartSize + gap);
      const heart = this.add.rectangle(x, startY, heartSize, heartSize, 0xef4444);
      heart.setScrollFactor(0);
      heart.setData('index', i);
      this.livesContainer.add(heart);
    }
    this.updateLivesHUD();
  }

  private updateLivesHUD(): void {
    if (!this.livesContainer) return;
    this.livesContainer.list.forEach((child, i) => {
      const go = child as Phaser.GameObjects.Rectangle;
      go.setAlpha(i < this.lives ? 1 : 0.25);
    });
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

    if (this.isTransitioning) return;

    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.isPaused = true;
      this.pauseOverlay?.setVisible(true);
      return;
    }

    this.player.update();
    const body = this.player.getBody();

    if (!this.checkpointTriggered && body.x >= this.mapWidthPx * CHECKPOINT_TRIGGER_RATIO) {
      this.checkpointTriggered = true;
      this.checkpointX = body.x;
      this.checkpointY = body.y;
    }

    if (this.checkDeathByFall(body)) {
      this.triggerDeath();
      return;
    }

    if (this.checkGoalReached(body)) {
      this.isTransitioning = true;
      const cx = body.x + body.width / 2;
      const cy = body.y + body.height / 2;
      spawnGoalEffect(this, cx, cy);
      this.soundManager.playGoal();
      this.time.delayedCall(450, () => {
        saveLastCompletedLevel(this.currentLevel);
        if (this.currentLevel === LEVEL_MAX) {
          this.scene.start(SCENE_KEY_WIN);
        } else {
          this.scene.start(SCENE_KEY_GAME, { level: this.currentLevel + 1 });
        }
      });
      return;
    }
  }

  private triggerDeath(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    const body = this.player.getBody();
    const cx = body.x + body.width / 2;
    const cy = body.y + body.height / 2;
    spawnDeathEffect(this, cx, cy);
    this.soundManager.playDeath();
    this.lives--;
    this.time.delayedCall(600, () => {
      if (this.lives > 0) {
        this.scene.start(SCENE_KEY_GAME, {
          level: this.currentLevel,
          spawnX: this.checkpointX,
          spawnY: this.checkpointY,
          lives: this.lives,
        });
      } else {
        this.scene.start(SCENE_KEY_GAME, { level: this.currentLevel });
      }
    });
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

  shutdown(): void {
    this.soundManager?.stopMusic();
  }
}
