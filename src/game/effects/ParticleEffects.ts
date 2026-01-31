import type { Scene } from 'phaser';

const PARTICLE_TEXTURE_KEY = 'particle_dot';

/**
 * Creates a small circle texture for particles if it doesn't exist.
 * Call once from scene create.
 */
export function ensureParticleTexture(scene: Scene): void {
  if (scene.textures.exists(PARTICLE_TEXTURE_KEY)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xffffff);
  g.fillCircle(4, 4, 4);
  g.generateTexture(PARTICLE_TEXTURE_KEY, 8, 8);
  g.destroy();
}

/**
 * Spawn a short burst of particles at (x, y). Green/gold tint for goal.
 */
export function spawnGoalEffect(scene: Scene, x: number, y: number): void {
  ensureParticleTexture(scene);
  const emitter = scene.add.particles(x, y, PARTICLE_TEXTURE_KEY, {
    speed: { min: 60, max: 140 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.8, end: 0 },
    lifespan: 400,
    tint: [0x22c55e, 0xfbbf24],
    blendMode: 'ADD',
    quantity: 14,
    frequency: -1,
  });
  emitter.explode(14);
  scene.time.delayedCall(450, () => emitter.destroy());
}

/**
 * Spawn a short dust burst at (x, y) for jump. Gray/beige, mostly downward.
 */
export function spawnJumpDust(scene: Scene, x: number, y: number): void {
  ensureParticleTexture(scene);
  const emitter = scene.add.particles(x, y, PARTICLE_TEXTURE_KEY, {
    speed: { min: 20, max: 70 },
    angle: { min: 200, max: 340 },
    scale: { start: 0.4, end: 0 },
    lifespan: 220,
    tint: [0xa8a29e, 0x78716c],
    blendMode: 'NORMAL',
    quantity: 8,
    frequency: -1,
    gravityY: 80,
  });
  emitter.explode(8);
  scene.time.delayedCall(250, () => emitter.destroy());
}

/**
 * Spawn a short burst of particles at (x, y). Red/dark for death.
 */
export function spawnDeathEffect(scene: Scene, x: number, y: number): void {
  ensureParticleTexture(scene);
  const emitter = scene.add.particles(x, y, PARTICLE_TEXTURE_KEY, {
    speed: { min: 80, max: 180 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    lifespan: 500,
    tint: [0xef4444, 0x7f1d1d],
    blendMode: 'NORMAL',
    quantity: 16,
    frequency: -1,
  });
  emitter.explode(16);
  scene.time.delayedCall(550, () => emitter.destroy());
}
