import type { Scene } from 'phaser';
import type { Physics } from 'phaser';

const MOVE_SPEED = 200;
const CROUCH_SPEED = 80;
const JUMP_FORCE = -350;
const STAND_HEIGHT = 24;
const CROUCH_HEIGHT = 12;

/**
 * Player character: left/right, jump, crouch (Down/S). Uses Arcade Physics.
 */
export class Player {
  private body: Physics.Arcade.Body;
  private rect: Phaser.GameObjects.Rectangle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keys: {
    a: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
  } | null = null;
  private isCrouching = false;

  constructor(
    private scene: Scene,
    x: number,
    y: number
  ) {
    const rect = scene.add.rectangle(x, y, 16, STAND_HEIGHT, 0x4ade80);
    scene.add.existing(rect);
    (scene.physics as Physics.Arcade.ArcadePhysics).add.existing(rect);
    const body = (rect as unknown as { body: Physics.Arcade.Body }).body;
    body.setCollideWorldBounds(true);
    body.setSize(16, STAND_HEIGHT);
    body.setOffset(0, 0);
    this.body = body;
    this.rect = rect;

    const keyboard = scene.input.keyboard;
    if (keyboard) {
      this.cursors = keyboard.createCursorKeys();
      this.keys = {
        a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      };
    }
  }

  /** Call from scene update(). Handles movement, jump, crouch. */
  update(): void {
    const left = this.cursors?.left.isDown ?? this.keys?.a.isDown ?? false;
    const right = this.cursors?.right.isDown ?? this.keys?.d.isDown ?? false;
    const jump = this.cursors?.up.isDown ?? this.keys?.w.isDown ?? this.keys?.space.isDown ?? false;
    const crouch = this.cursors?.down.isDown ?? this.keys?.s.isDown ?? false;

    if (crouch && !this.isCrouching) {
      this.isCrouching = true;
      this.body.setSize(16, CROUCH_HEIGHT);
      this.body.setOffset(0, STAND_HEIGHT - CROUCH_HEIGHT);
      this.rect.setSize(16, CROUCH_HEIGHT);
    } else if (!crouch && this.isCrouching) {
      this.isCrouching = false;
      this.body.setSize(16, STAND_HEIGHT);
      this.body.setOffset(0, 0);
      this.rect.setSize(16, STAND_HEIGHT);
    }

    const speed = this.isCrouching ? CROUCH_SPEED : MOVE_SPEED;
    if (left) this.body.setVelocityX(-speed);
    else if (right) this.body.setVelocityX(speed);
    else this.body.setVelocityX(0);

    const onGround = this.body.blocked.down || this.body.touching.down;
    if (jump && onGround && !this.isCrouching) this.body.setVelocityY(JUMP_FORCE);
  }

  /** The Arcade body (e.g. for velocity). */
  getBody(): Physics.Arcade.Body {
    return this.body;
  }

  /** The game object to use as first argument in physics.add.collider(). */
  getGameObject(): Phaser.GameObjects.GameObject {
    return this.body.gameObject;
  }
}
