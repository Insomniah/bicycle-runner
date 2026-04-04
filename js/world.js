// world.js – управление уровнем и фоном (рефакторинг: чистые функции)
import { Wheel } from './entities/wheel.js';

// Чистая функция: создаёт массив колёс из данных уровня
export function generateWheelsFromData(wheelsData) {
  if (!wheelsData) return [];
  return wheelsData.map(w => new Wheel(w.x, w.y));
}

// Чистая функция: определяет, какой фон нужно установить для уровня
export function resolveBackgroundImage(level, preloadedBackgrounds) {
  if (level.backgroundImage) {
    const cached = preloadedBackgrounds?.[level.backgroundImage];
    if (cached) return { source: cached, useCached: true, src: level.backgroundImage };
    else return { source: level.backgroundImage, useCached: false, src: level.backgroundImage };
  } else {
    const defaultBg = CONFIG.BACKGROUND_MOUNTAINS;
    const cached = preloadedBackgrounds?.[defaultBg];
    if (cached) return { source: cached, useCached: true, src: defaultBg };
    else return { source: defaultBg, useCached: false, src: defaultBg };
  }
}

// Объект мира (мутабельный, но использует чистые функции для генерации)
export const world = {
  sky: null,
  background: null,
  currentLevel: null,

  setLevel(level) {
    if (!level) return;
    this.currentLevel = level;
    if (level.generate) level.generate();

    // Генерация колёс через чистую функцию
    const newWheels = generateWheelsFromData(level.wheelsData);
    level.wheels = newWheels;

    if (window.decorations && window.decorations.generate) window.decorations.generate();

    // Смена фона
    if (this.background && level.backgroundImage) {
      const bgInfo = resolveBackgroundImage(level, window.preloadedBackgrounds);
      if (bgInfo.useCached) {
        this.background.setImage(bgInfo.source, bgInfo.src);
      } else {
        this.background.load(bgInfo.source).catch(console.warn);
      }
    } else if (this.background && !level.backgroundImage) {
      const bgInfo = resolveBackgroundImage(level, window.preloadedBackgrounds);
      if (bgInfo.useCached) {
        this.background.setImage(bgInfo.source, bgInfo.src);
      } else {
        this.background.load(bgInfo.source);
      }
    }

    if (window.game.player && window.game.player.initPosition) {
      window.game.player.initPosition();
    }

    if (window.game.player) {
      window.game.player.autoMove = false;
      window.game.player.moveLeft = false;
      window.game.player.moveRight = false;
    }

    if (window.game.camera) window.game.camera.initialized = false;

    if (this.sky && this.sky.generate) this.sky.generate();

    window.game.state.gameOver = false;
    console.log(`Switched to level: ${level.number}`);
  },

  getGroundBase() {
    if (this.currentLevel && typeof this.currentLevel.getGroundBase === 'function') {
      const val = this.currentLevel.getGroundBase();
      if (typeof val === 'number' && !isNaN(val)) {
        return val;
      }
    }
    console.warn("getGroundBase fallback to 0");
    return 0;
  },

  generateWheels(level) {
    // Оставлен для обратной совместимости, но теперь использует чистую функцию
    if (!level.wheelsData) return;
    level.wheels = generateWheelsFromData(level.wheelsData);
  },

  update(dt) {
    if (this.sky && this.sky.update) this.sky.update();
    if (this.background && this.background.update) this.background.update();
    if (this.currentLevel && this.currentLevel.wheels) {
      for (const wheel of this.currentLevel.wheels) {
        if (wheel.update) wheel.update(dt);
      }
    }
  },

  draw(ctx, camera) {
    if (this.sky && this.sky.draw) this.sky.draw(ctx, camera);
    if (this.background && this.background.draw) this.background.draw(ctx, camera);
  },

  drawWheels(ctx, camera) {
    if (this.currentLevel && this.currentLevel.wheels) {
      for (const wheel of this.currentLevel.wheels) {
        wheel.draw(ctx, camera);
      }
    }
  },
};

// Для обратной совместимости
window.game = window.game || {};
window.game.world = world;