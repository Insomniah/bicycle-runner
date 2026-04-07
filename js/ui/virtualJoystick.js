// ui/VirtualJoystick.js
export class VirtualJoystick {
  constructor(options = {}) {
    this.radius = options.radius || 70;
    this.active = false;
    this.touchId = null;
    this.deltaX = 0;
    this.deltaY = 0;
    this.centerX = options.x || 0;
    this.centerY = options.y || 0;
  }

  setPosition(x, y) {
    this.centerX = x;
    this.centerY = y;
  }

  handleStart(touch, canvas) {
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const dx = touchX - this.centerX;
    const dy = touchY - this.centerY;
    const dist = Math.hypot(dx, dy);
    // Увеличенная зона захвата (1.5 радиуса)
    if (dist <= this.radius * 1.5) {
      this.active = true;
      this.touchId = touch.identifier;
      this.updateDelta(touch, canvas);
      return true;
    }
    return false;
  }

  handleMove(touch, canvas) {
    if (!this.active || touch.identifier !== this.touchId) return false;
    this.updateDelta(touch, canvas);
    return true;
  }

  updateDelta(touch, canvas) {
    const rect = canvas.getBoundingClientRect();
    let touchX = touch.clientX - rect.left;
    let touchY = touch.clientY - rect.top;
    let dx = touchX - this.centerX;
    let dy = touchY - this.centerY;
    const dist = Math.hypot(dx, dy);
    if (dist > this.radius) {
      dx = dx / dist * this.radius;
      dy = dy / dist * this.radius;
    }
    this.deltaX = dx / this.radius;
    this.deltaY = dy / this.radius;
  }

  handleEnd(touch) {
    if (this.active && touch.identifier === this.touchId) {
      this.active = false;
      this.touchId = null;
      this.deltaX = 0;
      this.deltaY = 0;
      return true;
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#666";
    ctx.beginPath();
    ctx.arc(this.centerX + this.deltaX * this.radius, this.centerY + this.deltaY * this.radius, this.radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}