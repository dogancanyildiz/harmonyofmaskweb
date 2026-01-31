import type { Scene } from 'phaser';
import type { Physics } from 'phaser';
import {
  PLAYER_WIDTH,
  PLAYER_STAND_HEIGHT,
  PLAYER_CROUCH_HEIGHT,
  PLAYER_MOVE_SPEED,
  PLAYER_CROUCH_SPEED,
  PLAYER_JUMP_FORCE,
  PLAYER_COLOR,
  COYOTE_TIME_MS,
  JUMP_BUFFER_MS,
} from '../constants';

type PlayerKeys = {
  a: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
};

/**
 * Player character: movement (A/D or arrows), jump (W/Space/Up), crouch (S/Down).
 * Uses Arcade Physics; size and speeds from constants.
 */
export class Player {
  private body: Physics.Arcade.Body;
  private rect: Phaser.GameObjects.Rectangle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keys: PlayerKeys | null = null;
  private isCrouching = false;
  private lastOnGroundTime = 0;
  private jumpBufferUntil = 0;

  constructor(
    private scene: Scene,
    x: number,
    y: number,
    private onJump?: () => void
  ) {
    const rect = scene.add.rectangle(x, y, PLAYER_WIDTH, PLAYER_STAND_HEIGHT, PLAYER_COLOR);
    scene.add.existing(rect);
    (scene.physics as Physics.Arcade.ArcadePhysics).add.existing(rect);
    const body = (rect as unknown as { body: Physics.Arcade.Body }).body;
    body.setCollideWorldBounds(true);
    body.setSize(PLAYER_WIDTH, PLAYER_STAND_HEIGHT);
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

  /** Call from scene update(). Handles movement, jump, crouch, coyote time, jump buffer. */
  update(): void {
    const left = this.cursors?.left.isDown ?? this.keys?.a.isDown ?? false;
    const right = this.cursors?.right.isDown ?? this.keys?.d.isDown ?? false;
    const jump = this.cursors?.up.isDown ?? this.keys?.w.isDown ?? this.keys?.space.isDown ?? false;
    const jumpJustDown =
      (this.cursors?.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) ||
      (this.keys?.w && Phaser.Input.Keyboard.JustDown(this.keys.w)) ||
      (this.keys?.space && Phaser.Input.Keyboard.JustDown(this.keys.space)) ||
      false;
    const crouch = this.cursors?.down.isDown ?? this.keys?.s.isDown ?? false;
    const now = this.scene.time.now;

    if (crouch && !this.isCrouching) {
      this.isCrouching = true;
      this.body.setSize(PLAYER_WIDTH, PLAYER_CROUCH_HEIGHT);
      this.body.setOffset(0, PLAYER_STAND_HEIGHT - PLAYER_CROUCH_HEIGHT);
      this.rect.setSize(PLAYER_WIDTH, PLAYER_CROUCH_HEIGHT);
    } else if (!crouch && this.isCrouching) {
      this.isCrouching = false;
      this.body.setSize(PLAYER_WIDTH, PLAYER_STAND_HEIGHT);
      this.body.setOffset(0, 0);
      this.rect.setSize(PLAYER_WIDTH, PLAYER_STAND_HEIGHT);
    }

    const speed = this.isCrouching ? PLAYER_CROUCH_SPEED : PLAYER_MOVE_SPEED;
    if (left) this.body.setVelocityX(-speed);
    else if (right) this.body.setVelocityX(speed);
    else this.body.setVelocityX(0);

    const onGround = this.body.blocked.down || this.body.touching.down;
    if (onGround) this.lastOnGroundTime = now;
    const coyoteOk = !onGround && now - this.lastOnGroundTime <= COYOTE_TIME_MS;
    const canJumpFromGround = onGround || coyoteOk;

    if (jumpJustDown && !canJumpFromGround) this.jumpBufferUntil = now + JUMP_BUFFER_MS;
    const bufferOk = now <= this.jumpBufferUntil;

    const doJump = !this.isCrouching && (canJumpFromGround && (jump || bufferOk));
    if (doJump) {
      this.body.setVelocityY(PLAYER_JUMP_FORCE);
      this.onJump?.();
      this.jumpBufferUntil = 0;
    }
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
