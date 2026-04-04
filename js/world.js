// world.js – управление уровнем и фоном (с поддержкой смены фона)

window.game = window.game || {};
window.game.world = {
  sky: null,
  mountains: null,
  currentLevel: null,

  setLevel(level) {
    if (!level) return;
    this.currentLevel = level;
    if (level.generate) level.generate();
    this.generateWheels(level);
    if (window.decorations && window.decorations.generate) window.decorations.generate();

    // Смена фона (горы/заводы) в зависимости от уровня
    if (this.mountains && level.backgroundImage) {
      // Если уже загружено изображение из предзагрузки – используем его
      const cachedImg = window.preloadedBackgrounds?.[level.backgroundImage];
      if (cachedImg) {
        this.mountains.setImage(cachedImg, level.backgroundImage);
      } else {
        // иначе загружаем динамически (но лучше предзагружать)
        this.mountains.load(level.backgroundImage).catch(console.warn);
      }
    } else if (this.mountains && !level.backgroundImage) {
      // fallback на горы по умолчанию
      const defaultBg = CONFIG.BACKGROUND_MOUNTAINS;
      if (window.preloadedBackgrounds?.[defaultBg]) {
        this.mountains.setImage(window.preloadedBackgrounds[defaultBg], defaultBg);
      } else {
        this.mountains.load(defaultBg);
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
    console.log(`Switched to level: ${level === window.level1 ? "level1" : "level2"}`);
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
      level.wheels.push(new Wheel(w.x, w.y));
    }
  },

  update(dt) {
    if (this.sky && this.sky.update) this.sky.update();
    if (this.mountains && this.mountains.update) this.mountains.update();
    if (this.currentLevel && this.currentLevel.wheels) {
      for (const wheel of this.currentLevel.wheels) {
        if (wheel.update) wheel.update(dt);
      }
    }
  },

  draw(ctx, camera) {
    if (this.sky && this.sky.draw) this.sky.draw(ctx, camera);
    if (this.mountains && this.mountains.draw) this.mountains.draw(ctx, camera);
  },

  drawWheels(ctx, camera) {
    if (this.currentLevel && this.currentLevel.wheels) {
      for (const wheel of this.currentLevel.wheels) {
        wheel.draw(ctx, camera);
      }
    }
  },
};