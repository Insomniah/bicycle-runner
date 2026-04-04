// scenery/background.js – универсальный фон (горы/заводы) с масштабированием (модуль)
import { canvas } from '../game.js';

// Чистая функция: возвращает массив участков для отрисовки (x, y, w, h)
export function calculateBackgroundTiles(img, scale, cameraX, cameraY, groundY, canvasWidth, buryFactor) {
  const imgW = img.width * scale;
  const imgH = img.height * scale;
  const y = groundY - imgH * (1 - buryFactor) - cameraY;
  const startX = Math.floor(cameraX / imgW) * imgW;
  const tiles = [];
  for (let x = startX; x < cameraX + canvasWidth + imgW; x += imgW) {
    tiles.push({ x: x - cameraX, y, w: imgW, h: imgH });
  }
  return tiles;
}

export const background = {
  img: null,
  loaded: false,
  currentSrc: null,

  load(src) {
    if (this.currentSrc === src && this.loaded) return Promise.resolve(this.img);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.img = img;
        this.loaded = true;
        this.currentSrc = src;
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  },

  setImage(imgElement, src) {
    this.img = imgElement;
    this.loaded = true;
    this.currentSrc = src || (imgElement ? imgElement.src : null);
  },

  generate() {
    if (!this.img && window.CONFIG && window.CONFIG.BACKGROUND_MOUNTAINS) {
      this.load(window.CONFIG.BACKGROUND_MOUNTAINS);
    }
  },

  update() {},

  draw(ctx, camera) {
    if (!this.loaded || !this.img) return;

    const level = window.game.world.currentLevel;
    if (!level) return;

    let scale = 1;
    if (window.CONFIG && window.CONFIG.BACKGROUND_SCALE && this.currentSrc) {
      scale = window.CONFIG.BACKGROUND_SCALE[this.currentSrc] || 1;
    }

    const groundY = level.getGroundBase();
    const tiles = calculateBackgroundTiles(
      this.img, scale, camera.x, camera.y, groundY,
      canvas.width, CONFIG.MOUNTAINS_BURY_FACTOR
    );

    for (const tile of tiles) {
      ctx.drawImage(this.img, tile.x, tile.y, tile.w, tile.h);
    }
  }
};

// Для обратной совместимости (если где-то используется window.background)
window.background = background;