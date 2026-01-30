import Phaser from 'phaser';
import { gameConfig } from './game/config';

document.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(gameConfig);
});
