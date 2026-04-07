// ui/JumpButton.js
export class JumpButton {
  constructor(options = {}) {
    this.x = options.x || null; // привязка справа
    this.y = options.y || null;
    this.radius = options.radius || 60;
    this.active = false;
    this.touchId = null;
  }

  setPosition(canvasWidth, canvasHeight) {
    if (this.x === null) {
      this.centerX = canvasWidth - this.radius - 20;
    } else {
      this.centerX = this.x;
    }
    if (this.y === null) {
      this.centerY = canvasHeight - this.radius - 20;
    } else {
      this.centerY = this.y;
    }
  }

  handleStart(touch, canvas) {
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const dx = touchX - this.centerX;
    const dy = touchY - this.centerY;
    if (Math.hypot(dx, dy) <= this.radius) {
      this.active = true;
      this.touchId = touch.identifier;
      return true;
    }
    return false;
  }

  handleEnd(touch) {
    if (this.active && touch.identifier === this.touchId) {
      this.active = false;
      this.touchId = null;
      return true;
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.active ? 0.8 : 0.5;
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = `${this.radius * 0.5}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("JUMP", this.centerX, this.centerY);
    ctx.restore();
  }
}