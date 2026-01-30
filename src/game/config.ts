import type { Types } from 'phaser';
import { GameScene } from './scenes/GameScene';

/**
 * Phaser game configuration.
 * Pixel-art friendly (no smoothing, round pixels), Arcade physics, single GameScene.
 */
export const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 180,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
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
      gravity: { x: 0, y: 600 },
      debug: false,
    },
  },
  scene: [GameScene],
};
