// world.js – управление уровнем и фоном (внедрение зависимостей)
import { Wheel } from './entities/wheel.js';
import { player } from './player.js';
import { decorations } from './scenery/decorations.js';
import { background } from './scenery/background.js';
import { sky } from './scenery/sky.js';
import { gameState, GameState } from './core/stateMachine.js';
import { eventBus } from './core/eventBus.js';

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

export const world = {
  currentLevel: null,

  setLevel(level) {
    if (!level) return;
    this.currentLevel = level;
    if (level.generate) level.generate();

    // Генерация колёс через чистую функцию
    const newWheels = generateWheelsFromData(level.wheelsData);
    level.wheels = newWheels;

    if (decorations && decorations.generate) decorations.generate();

    // Смена фона
    if (background && level.backgroundImage) {
      const bgInfo = resolveBackgroundImage(level, window.preloadedBackgrounds);
      if (bgInfo.useCached) {
        background.setImage(bgInfo.source, bgInfo.src);
      } else {
        background.load(bgInfo.source).catch(console.warn);
      }
    } else if (background && !level.backgroundImage) {
      const bgInfo = resolveBackgroundImage(level, window.preloadedBackgrounds);
      if (bgInfo.useCached) {
        background.setImage(bgInfo.source, bgInfo.src);
      } else {
        background.load(bgInfo.source);
      }
    }

    if (player && player.initPosition) {
      player.initPosition();
    }

    if (player) {
      player.autoMove = false;
      player.moveLeft = false;
      player.moveRight = false;
    }

    // Сброс камеры (теперь обращаемся к глобальной камере, но позже внедрим)
    if (window.game.camera) window.game.camera.initialized = false;

    if (sky && sky.generate) sky.generate();

    // Сброс состояния автомата (если нужно)
    if (gameState.state !== GameState.PLAYING) {
      // Но не форсируем, только если уровень переключается вручную
    }
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
    if (!level.wheelsData) return;
    level.wheels = generateWheelsFromData(level.wheelsData);
  },

  update(dt) {
    if (sky && sky.update) sky.update();
    if (background && background.update) background.update();
    if (this.currentLevel && this.currentLevel.wheels) {
      for (const wheel of this.currentLevel.wheels) {
        if (wheel.update) wheel.update(dt);
      }
    }
  },

  draw(ctx, camera) {
    if (sky && sky.draw) sky.draw(ctx, camera);
    if (background && background.draw) background.draw(ctx, camera);
  },

  drawWheels(ctx, camera) {
    if (this.currentLevel && this.currentLevel.wheels) {
      for (const wheel of this.currentLevel.wheels) {
        wheel.draw(ctx, camera);
      }
    }
  }
};

// Для обратной совместимости
window.game = window.game || {};
window.game.world = world;