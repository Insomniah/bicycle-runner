// camera.js – модуль камеры
export const camera = {
  x: 0,
  y: 0,
  initialized: false,

  update() {
    const level = window.game.world ? window.game.world.currentLevel : null;
    const player = window.game.player;
    if (!player || !level) return;

    if (!canvas || !canvas.width || !canvas.height || isNaN(canvas.height)) {
      console.warn("camera: canvas not ready, calling rebuildWorld?");
      if (typeof rebuildWorld === 'function') rebuildWorld();
      return;
    }

    if (typeof player.y !== 'number' || isNaN(player.y)) {
      console.warn("camera: player.y is NaN, skipping update");
      return;
    }

    // Горизонталь
    this.x = player.x - canvas.width * CONFIG.CAMERA_HORIZONTAL_OFFSET;
    if (this.x < 0) this.x = 0;
    if (this.x > level.width - canvas.width) {
      this.x = level.width - canvas.width;
    }

    const desiredGround = canvas.height * CONFIG.CAMERA_GROUND_TARGET;
    const groundY = level.getGroundBase();
    if (typeof groundY !== 'number' || isNaN(groundY)) {
      console.error("Invalid groundY:", groundY);
      return;
    }
    const minCameraY = groundY - desiredGround;

    if (!this.initialized) {
      this.y = minCameraY;
      this.initialized = true;
      return;
    }

    const targetY = player.y - canvas.height / 2;
    this.y += (targetY - this.y) * CONFIG.CAMERA_VERTICAL_SMOOTHING;
    if (this.y > minCameraY) {
      this.y = minCameraY;
    }
  }
};

// Для обратной совместимости
window.game = window.game || {};
window.game.camera = camera;