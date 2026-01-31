/**
 * Per-level config for stars and moving platforms (levels 6+).
 * Positions in pixels. Map size for 6–8: 45×16 = 720 width, 14×16 = 224 height.
 */

import { TILE_SIZE } from './constants';

const W = 45 * TILE_SIZE; // 720
const H = 14 * TILE_SIZE; // 224
const groundY = H - TILE_SIZE - 12; // ~196

export interface StarPosition {
  x: number;
  y: number;
}

export interface MovingPlatformDef {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  leftBound: number;
  rightBound: number;
}

/** Stars per level (pixel positions). Levels 6+ have 3 stars. */
export const LEVEL_STARS: Record<number, StarPosition[]> = {
  6: [
    { x: 120, y: groundY - 40 },
    { x: 360, y: groundY - 80 },
    { x: 580, y: groundY - 40 },
  ],
  7: [
    { x: 80, y: groundY - 60 },
    { x: 280, y: groundY - 100 },
    { x: 520, y: groundY - 70 },
  ],
  8: [
    { x: 150, y: groundY - 90 },
    { x: 360, y: groundY - 120 },
    { x: 600, y: groundY - 90 },
  ],
};

/** Moving platforms per level. vx in px/s; bounds in px. */
export const LEVEL_PLATFORMS: Record<number, MovingPlatformDef[]> = {
  6: [
    { x: 200, y: groundY - 30, width: 72, height: 12, vx: 45, leftBound: 180, rightBound: 420 },
  ],
  7: [
    { x: 180, y: groundY - 50, width: 64, height: 12, vx: 55, leftBound: 160, rightBound: 380 },
    { x: 420, y: groundY - 85, width: 56, height: 12, vx: -40, leftBound: 380, rightBound: 580 },
  ],
  8: [
    { x: 160, y: groundY - 40, width: 56, height: 12, vx: 50, leftBound: 140, rightBound: 320 },
    { x: 360, y: groundY - 90, width: 48, height: 12, vx: -45, leftBound: 300, rightBound: 480 },
    { x: 520, y: groundY - 55, width: 64, height: 12, vx: 40, leftBound: 480, rightBound: 660 },
  ],
};

export function getStarsForLevel(level: number): StarPosition[] {
  return LEVEL_STARS[level] ?? [];
}

export function getPlatformsForLevel(level: number): MovingPlatformDef[] {
  return LEVEL_PLATFORMS[level] ?? [];
}
