import type { Types } from 'phaser';
import { GameScene } from './scenes/GameScene';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY_Y,
  BACKGROUND_COLOR,
} from './constants';

/**
 * Phaser game configuration.
 * Pixel-art friendly (no smoothing, round pixels), Arcade physics, single GameScene.
 */
export const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: BACKGROUND_COLOR,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY_Y },
      debug: false,
    },
  },
  scene: [GameScene],
};
