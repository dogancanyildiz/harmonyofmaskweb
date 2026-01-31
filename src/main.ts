import Phaser from 'phaser';
import { gameConfig } from './game';

document.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(gameConfig);
});
