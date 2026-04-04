// world.js – управление уровнем и фоном

import { Wheel } from './entities/wheel.js';

export const world = {
  sky: null,
  background: null,
  currentLevel: null,

  setLevel(level) {
    if (!level) return;
    this.currentLevel = level;
    if (level.generate) level.generate();
    this.generateWheels(level);
    if (window.decorations && window.decorations.generate) window.decorations.generate();

    if (this.background && level.backgroundImage) {
      const cachedImg = window.preloadedBackgrounds?.[level.backgroundImage];
      if (cachedImg) {
        this.background.setImage(cachedImg, level.backgroundImage);
      } else {
        this.background.load(level.backgroundImage).catch(console.warn);
      }
    } else if (this.background && !level.backgroundImage) {
      const defaultBg = CONFIG.BACKGROUND_MOUNTAINS;
      if (window.preloadedBackgrounds?.[defaultBg]) {
        this.background.setImage(window.preloadedBackgrounds[defaultBg], defaultBg);
      } else {
        this.background.load(defaultBg);
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
    if (!level.wheelsData) return;
    level.wheels = [];
    for (const w of level.wheelsData) {
      // Используем глобальный класс Wheel (доступен из wheel.js)
      level.wheels.push(new Wheel(w.x, w.y));
    }
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

window.game = window.game || {};
window.game.world = world;