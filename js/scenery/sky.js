// scenery/sky.js – облака (модуль) с чистыми функциями
import { canvas } from '../game.js';

// Чистая функция: генерирует массив облаков на основе параметров
export function generateClouds(levelWidth, canvasHeight, config) {
  const clouds = [];
  const spacing = 200;
  const count = Math.ceil(levelWidth / spacing);
  const minY = 40;
  const maxY = canvasHeight * 0.25;

  for (let i = 0; i < count; i++) {
    const size = 60 + Math.random() * 80;
    clouds.push({
      x: i * spacing + Math.random() * 200,
      y: minY + Math.random() * (maxY - minY),
      w: size,
      h: size * 0.4,
      parallax: config.SKY_PARALLAX
    });
  }
  return clouds;
}

// Чистая функция: обновляет позиции облаков (возвращает новый массив)
export function updateClouds(clouds, windSpeed, levelWidth, wrapMargin) {
  return clouds.map(cloud => {
    let newX = cloud.x - windSpeed;
    const limit = levelWidth + wrapMargin;
    if (newX < -cloud.w) newX = limit;
    else if (newX > limit) newX = -cloud.w;
    return { ...cloud, x: newX };
  });
}

// Чистая функция: возвращает параметры отрисовки облака или null, если оно вне экрана
export function getCloudDrawParams(cloud, cameraX, canvasWidth, wrapMargin) {
  const x = cloud.x - cameraX * cloud.parallax;
  if (x < -wrapMargin || x > canvasWidth + wrapMargin) return null;
  return { x, y: cloud.y, w: cloud.w, h: cloud.h };
}

// Объект неба (использует чистые функции)
export const sky = {
  clouds: [],
  windSpeed: CONFIG.SKY_WIND_SPEED,

  generate() {
    const level = window.game.world.currentLevel;
    if (!level) return;
    this.clouds = generateClouds(level.width, canvas.height, CONFIG);
  },

  update() {
    const level = window.game.world.currentLevel;
    if (!level) return;
    this.clouds = updateClouds(this.clouds, this.windSpeed, level.width, CONFIG.SKY_CLOUD_WRAP_MARGIN);
  },

  draw(ctx, camera) {
    ctx.fillStyle = "rgba(208,232,255,0.9)";
    for (const cloud of this.clouds) {
      const params = getCloudDrawParams(cloud, camera.x, canvas.width, CONFIG.SKY_CLOUD_WRAP_MARGIN);
      if (!params) continue;
      const { x, y, w, h } = params;
      ctx.fillRect(x, y, w, h);
      ctx.fillRect(x + w * 0.3, y - h * 0.3, w * 0.6, h);
      ctx.fillRect(x + w * 0.6, y, w * 0.5, h);
    }
  }
};