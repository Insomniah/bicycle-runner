// core/spriteAnimator.js
export class SpriteAnimator {
  constructor(frameCount, frameInterval, startFrame = 0) {
    this.frameCount = frameCount;
    this.frameInterval = frameInterval;
    this.currentFrame = startFrame;
    this.timer = 0;
  }

  update(dt) {
    if (this.frameCount <= 1) return;
    this.timer += dt;
    if (this.timer >= this.frameInterval) {
      this.timer -= this.frameInterval;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  getFrame() {
    return this.currentFrame;
  }

  reset() {
    this.currentFrame = 0;
    this.timer = 0;
  }
}