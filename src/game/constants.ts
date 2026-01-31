/**
 * Central game constants. Single source of truth for dimensions, physics, and UI.
 * Base unit: TILE_SIZE (16px) — tiles, player width, and hotbar slots align to it.
 */

/** 1 tile = 16px (tilemap, player width, hotbar slot). */
export const TILE_SIZE = 16;

// ——— Display & physics (Phaser config) ———
export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;
export const GRAVITY_Y = 600;
export const BACKGROUND_COLOR = '#1a1a2e';

// ——— Player ———
export const PLAYER_WIDTH = TILE_SIZE;
export const PLAYER_STAND_HEIGHT = 24;
export const PLAYER_CROUCH_HEIGHT = 12;
export const PLAYER_MOVE_SPEED = 200;
export const PLAYER_CROUCH_SPEED = 80;
export const PLAYER_JUMP_FORCE = -350;
export const PLAYER_COLOR = 0x4ade80;
/** Coyote time: can still jump this many ms after leaving ground (px-perfect feel). */
export const COYOTE_TIME_MS = 100;
/** Jump buffer: if jump was pressed this many ms before landing, jump on next ground contact. */
export const JUMP_BUFFER_MS = 120;
/** Max jumps in air (1 = single, 2 = double jump). */
export const MAX_JUMPS = 2;

// ——— World / scene ———
export const SCENE_KEY_MENU = 'MainMenuScene';
export const SCENE_KEY_GAME = 'GameScene';
export const SCENE_KEY_WIN = 'WinScene';
export const SCENE_KEY_SETTINGS = 'SettingsScene';
export const SCENE_KEY_RANKING = 'RankingScene';
export const SCENE_KEY_LEVEL_SELECT = 'LevelSelectScene';
export const SCENE_KEY_CONTROLS = 'ControlsScene';
export const LEVEL_MIN = 1;
export const LEVEL_MAX = 8;
export const LEVEL_MAP_KEYS: Record<number, string> = {
  1: 'tilemap',
  2: 'tilemap2',
  3: 'tilemap3',
  4: 'tilemap4',
  5: 'tilemap5',
  6: 'tilemap6',
  7: 'tilemap7',
  8: 'tilemap8',
};
/** Stars per level (for levels that have stars). */
export const STARS_PER_LEVEL = 3;
/** Star radius (px) for overlap. */
export const STAR_RADIUS = 8;
export const STAR_COLOR = 0xfbbf24;
export const TILESET_IMAGE_KEY = 'tileset';
export const LAYER_NAME_GREEN = 'green';
export const LAYER_NAME_RED = 'red';
export const LAYER_NAME_BLUE = 'blue';

/** Level index from which falling below map = death (restart level). */
export const DEATH_FALL_LEVEL_MIN = 3;
/** Pixels below map bottom to trigger death. */
export const DEATH_FALL_MARGIN = TILE_SIZE * 2;
/** Extra world height below map for levels >= DEATH_FALL_LEVEL_MIN. */
export const VOID_HEIGHT = 200;

/** Spawn X (px) from left. */
export const SPAWN_OFFSET_X = TILE_SIZE * 3;
/** Spawn Y = mapHeightPx - SPAWN_OFFSET_Y. */
export const SPAWN_OFFSET_Y = TILE_SIZE * 3;
/** When player passes this fraction of map width, checkpoint is set. */
export const CHECKPOINT_TRIGGER_RATIO = 0.4;
/** Max lives per level; 0 = respawn at checkpoint. */
export const LIVES_MAX = 3;

/** Goal zone width (px). */
export const GOAL_ZONE_WIDTH = 40;
/** Goal zone height (px). */
export const GOAL_ZONE_HEIGHT = 80;
/** Goal zone X = mapWidthPx - GOAL_ZONE_OFFSET_RIGHT. */
export const GOAL_ZONE_OFFSET_RIGHT = TILE_SIZE * 2;
/** Goal zone Y = mapHeightPx - GOAL_ZONE_OFFSET_BOTTOM. */
export const GOAL_ZONE_OFFSET_BOTTOM = 80;

export const GOAL_COLOR_NORMAL = 0x22c55e;
export const GOAL_COLOR_FINAL = 0xfbbf24;
export const GOAL_ALPHA = 0.35;

/** Camera follow lerp (x, y). */
export const CAMERA_FOLLOW_LERP = 0.1;

// ——— Tile layers (tint) ———
export const LAYER_TINT_RED = 0xef4444;
export const LAYER_TINT_GREEN = 0x22c55e;
export const LAYER_TINT_BLUE = 0x3b82f6;

// ——— Hotbar ———
export const HOTBAR_SLOT_COUNT = 5;
export const HOTBAR_SLOT_SIZE = TILE_SIZE;
export const HOTBAR_SLOT_GAP = 2;
export const HOTBAR_BORDER_WIDTH = 1;
/** Distance from bottom of screen to hotbar center (px). */
export const HOTBAR_BOTTOM_OFFSET = 14;
/** Icon inside slot = SLOT_SIZE - (2 * HOTBAR_ICON_INSET). */
export const HOTBAR_ICON_INSET = 3;

export const HOTBAR_COLOR_BORDER = 0x4a5568;
export const HOTBAR_COLOR_BORDER_SELECTED = 0xfbbf24;
export const HOTBAR_COLOR_BG = 0x1e293b;
export const HOTBAR_COLOR_RED = 0xef4444;
export const HOTBAR_COLOR_GREEN = 0x22c55e;
export const HOTBAR_COLOR_BLUE = 0x3b82f6;

/** Key codes for hotbar slot selection (keys 1–5). */
export const HOTBAR_KEY_CODES: readonly number[] = [49, 50, 51, 52, 53];
