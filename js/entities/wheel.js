// wheel.js – класс колеса с SpriteAnimator
import { SpriteAnimator } from '../core/spriteAnimator.js';

export class Wheel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.WHEEL_DRAW_SIZE;
    this.height = CONFIG.WHEEL_DRAW_SIZE;
    this.collected = false;
    this.animator = new SpriteAnimator(CONFIG.WHEEL_FRAME_COUNT, CONFIG.WHEEL_FRAME_INTERVAL);
  }

  update(dt) {
    if (this.collected) return;
    this.animator.update(dt);
  }

  draw(ctx, camera) {
    if (this.collected) return;
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;
    const frame = this.animator.getFrame();
    const srcX = frame * CONFIG.WHEEL_FRAME_W;
    const srcY = CONFIG.WHEEL_SPRITE_SRC_Y;
    const srcW = CONFIG.WHEEL_FRAME_W;
    const srcH = CONFIG.WHEEL_SPRITE_SRC_H;
    if (window.wheelSprite) {
      ctx.drawImage(
        window.wheelSprite,
        srcX, srcY, srcW, srcH,
        screenX, screenY, this.width, this.height
      );
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(screenX + this.width/2, screenY + this.height/2, this.width/2, 0, Math.PI*2);
      ctx.fill();
    }
  }

  collect(player) {
    if (this.collected) return false;
    if (player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.y + player.height > this.y) {
      this.collected = true;
      return true;
    }
    return false;
  }
}