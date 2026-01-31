import type { Types } from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { WinScene } from './scenes/WinScene';
import { SettingsScene } from './scenes/SettingsScene';
import { RankingScene } from './scenes/RankingScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { ControlsScene } from './scenes/ControlsScene';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY_Y,
  BACKGROUND_COLOR,
} from './constants';

/**
 * Phaser game configuration.
 * First scene: main menu. Pixel-art, Arcade physics.
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
  scene: [MainMenuScene, GameScene, WinScene, SettingsScene, RankingScene, LevelSelectScene, ControlsScene],
};
