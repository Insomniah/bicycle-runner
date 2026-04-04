// player.js – упрощённая версия с работающим автодвижением
import { handleCollisions } from './collision.js';
import { eventBus } from './core/eventBus.js';
import { gameState, GameState } from './core/stateMachine.js';

export const player = {
  x: CONFIG.PLAYER_START_X,
  y: 0,
  width: CONFIG.PLAYER_WIDTH,
  height: CONFIG.PLAYER_HEIGHT,
  speed: CONFIG.PLAYER_SPEED,
  vy: 0,
  gravity: CONFIG.PLAYER_GRAVITY,
  jumpPower: CONFIG.PLAYER_JUMP_POWER,
  onGround: false,
  moveLeft: false,
  moveRight: false,
  autoMove: false,
  prevY: 0,
  sprite: null,
  frameX: 0,
  frameY: 0,
  frameWidth: CONFIG.PLAYER_FRAME_WIDTH,
  frameHeight: CONFIG.PLAYER_FRAME_HEIGHT,
  frameCount: CONFIG.PLAYER_FRAME_COUNT,
  frameTimer: 0,
  frameInterval: CONFIG.PLAYER_FRAME_INTERVAL,
  hitboxOffsetX: CONFIG.PLAYER_HITBOX_OFFSET_X,
  coyoteTimer: 0,
  wasOnGround: false,

  jump() {
    const canJump = (this.onGround || this.coyoteTimer > 0) && gameState.state === GameState.PLAYING;
    if (canJump) {
      this.vy = this.jumpPower;
      this.onGround = false;
      this.coyoteTimer = 0;
      this.wasOnGround = false;
    }
  },

  draw(ctx, camera) {
    if (!this.sprite || !this.sprite.complete) return;
    ctx.save();
    const drawW = CONFIG.PLAYER_DRAW_WIDTH;
    const drawH = CONFIG.PLAYER_HEIGHT;
    const visualOffsetX = (drawW - CONFIG.PLAYER_WIDTH) / 2;
    const drawX = this.x - camera.x - visualOffsetX;
    const drawY = this.y - camera.y;
    const srcX = this.frameX * CONFIG.PLAYER_FRAME_WIDTH + CONFIG.PLAYER_SRC_VISIBLE_X;
    const srcY = CONFIG.PLAYER_SRC_VISIBLE_Y;
    const srcW = CONFIG.PLAYER_SRC_VISIBLE_W;
    const srcH = CONFIG.PLAYER_SRC_VISIBLE_H;
    if (this.moveLeft) {
      ctx.translate(drawX + drawW, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(this.sprite, srcX, srcY, srcW, srcH, 0, 0, drawW, drawH);
    } else {
      ctx.drawImage(this.sprite, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drawH);
    }
    ctx.restore();
  },

  initPosition() {
    const level = window.game.world.currentLevel;
    if (!level) return;
    this.y = level.getGroundBase() - this.height;
    this.x = CONFIG.PLAYER_START_X;
    this.vy = 0;
    this.onGround = false;
    this.autoMove = false;
    this.coyoteTimer = 0;
    this.wasOnGround = false;
    console.log("Player initialized at", { x: this.x, y: this.y });
  },

  update(dt) {
    const level = window.game.world.currentLevel;
    if (!level) return;

    // Сбор колёс
    if (level.wheels) {
      for (let i = 0; i < level.wheels.length; i++) {
        const wheel = level.wheels[i];
        if (wheel.collect(this)) {
          window.game.state.wheelsCollected++;
          eventBus.emit('wheel.collected', { count: window.game.state.wheelsCollected });
          level.wheels.splice(i, 1);
          i--;
        }
      }
    }

    this.prevY = this.y;
    const frame = Math.max(CONFIG.MIN_FRAME, Math.min(dt * 60, CONFIG.MAX_FRAME));

    // Завершение уровня
    const atFinish = this.x + this.width >= level.width - CONFIG.FINISH_THRESHOLD;
    if (atFinish && gameState.state === GameState.PLAYING) {
      gameState.transition('complete');
      this.autoMove = true;
    }

    // Движение
    if (gameState.state === GameState.PLAYING) {
      if (this.moveLeft) this.x -= this.speed * frame;
      if (this.moveRight) this.x += this.speed * frame;
    } else if (gameState.state === GameState.LEVEL_COMPLETE && this.autoMove) {
      const maxX = level.width + CONFIG.AUTO_MOVE_EXTRA;
      if (this.x < maxX) this.x += this.speed * frame;
      else this.autoMove = false;
      this.moveLeft = false;
      this.moveRight = false;
    }

    // Гравитация
    this.vy += this.gravity * frame;
    this.y += this.vy * frame;

    // Коллизии
    const { onGround } = handleCollisions(this, level);
    this.onGround = onGround;

    // Coyote Time
    if (this.onGround) {
      this.coyoteTimer = CONFIG.PLAYER_COYOTE_TIME;
      this.wasOnGround = true;
    } else {
      if (this.wasOnGround && this.coyoteTimer > 0) this.coyoteTimer -= dt;
      else this.wasOnGround = false;
    }

    // Границы
    if (this.x < 0) this.x = 0;
    if (!this.autoMove && this.x + this.width > level.width && gameState.state !== GameState.LEVEL_COMPLETE) {
      this.x = level.width - this.width;
    }

    // Падение
    const bottomLimit = level.height + CONFIG.FALL_LIMIT_OFFSET;
    if (this.y > bottomLimit) {
      this.y = bottomLimit;
      this.vy = 0;
      if (gameState.state === GameState.PLAYING) {
        gameState.transition('fail');
      }
      this.moveLeft = false;
      this.moveRight = false;
    }

    // Анимация
    this.frameTimer += dt;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX = (this.frameX + 1) % this.frameCount;
    }
  }
};