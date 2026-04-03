// background.js – фон гор/заводов (тайлинг с параллаксом, с поддержкой масштаба)

const background = {
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

    // Получаем масштаб для текущего фона
    let scale = 1;
    if (window.CONFIG && window.CONFIG.BACKGROUND_SCALE && this.currentSrc) {
      scale = window.CONFIG.BACKGROUND_SCALE[this.currentSrc] || 1;
    }

    const imgW = this.img.width * scale;
    const imgH = this.img.height * scale;
    const groundY = level.getGroundBase();
    const buryFactor = CONFIG.MOUNTAINS_BURY_FACTOR;
    const y = groundY - imgH * (1 - buryFactor) - camera.y;

    let startX = Math.floor(camera.x / imgW) * imgW;
    for (let x = startX; x < camera.x + canvas.width + imgW; x += imgW) {
      ctx.drawImage(this.img, x - camera.x, y, imgW, imgH);
    }
  },
};