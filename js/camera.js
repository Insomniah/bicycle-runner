// camera.js – модуль камеры (рефакторинг: чистая функция расчёта)
import { canvas } from './game.js';
import { rebuildWorld } from './core/canvas.js';

// Чистая функция: вычисляет новую позицию камеры на основе параметров
export function calculateCameraPosition({
  playerX,
  playerY,
  levelWidth,
  canvasWidth,
  canvasHeight,
  groundY,
  isInitialized,
  currentY,
  smoothing = CONFIG.CAMERA_VERTICAL_SMOOTHING
}) {
  // Горизонталь
  let newX = playerX - canvasWidth * CONFIG.CAMERA_HORIZONTAL_OFFSET;
  if (newX < 0) newX = 0;
  if (newX > levelWidth - canvasWidth) newX = levelWidth - canvasWidth;

  const desiredGround = canvasHeight * CONFIG.CAMERA_GROUND_TARGET;
  const minCameraY = groundY - desiredGround;

  let newY;
  let newInitialized = isInitialized;

  if (!isInitialized) {
    newY = minCameraY;
    newInitialized = true;
  } else {
    const targetY = playerY - canvasHeight / 2;
    newY = currentY + (targetY - currentY) * smoothing;
    if (newY > minCameraY) newY = minCameraY;
  }

  return { x: newX, y: newY, initialized: newInitialized };
}

// Объект камеры
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

    const groundY = level.getGroundBase();
    if (typeof groundY !== 'number' || isNaN(groundY)) {
      console.error("Invalid groundY:", groundY);
      return;
    }

    const newPos = calculateCameraPosition({
      playerX: player.x,
      playerY: player.y,
      levelWidth: level.width,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      groundY: groundY,
      isInitialized: this.initialized,
      currentY: this.y,
      smoothing: CONFIG.CAMERA_VERTICAL_SMOOTHING
    });

    this.x = newPos.x;
    this.y = newPos.y;
    this.initialized = newPos.initialized;
  }
};

// Для обратной совместимости
window.game = window.game || {};
window.game.camera = camera;