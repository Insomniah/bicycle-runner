// rocks.js – камни на первом уровне, шины на втором

const decorations = {
  list: [],
  rockTypes: [
    { src: "assets/rocks/middle_lane_rock1_1.png" },
    { src: "assets/rocks/middle_lane_rock1_2.png" },
    { src: "assets/rocks/middle_lane_rock1_3.png" },
    { src: "assets/rocks/middle_lane_rock1_4.png" },
    { src: "assets/rocks/middle_lane_rock1_5.png" }
  ],
  tireTypes: [
    { src: "assets/tires/tire-1.png" },
    { src: "assets/tires/tire-2.png" }
  ],
  rockImages: [],
  tireImages: [],
  loaded: false,

  setRockImages(images) {
    this.rockImages = images;
    this.loaded = true;
  },

  setTireImages(images) {
    this.tireImages = images;
  },

  generate() {
    this.list = [];
    const level = window.game.world.currentLevel;
    if (!level || !level.groundPlatforms) return;

    const useTires = (level.number === 2);
    const images = useTires ? this.tireImages : this.rockImages;
    if (!images.length) return;

    // Для шин используем масштаб 0.5 (уменьшаем в 2 раза)
    const scale = useTires ? 0.2 : 1;
    const margin = CONFIG.ROCKS_MARGIN;
    // Для второго уровня увеличиваем количество объектов на платформу
    const perPlatform = useTires ? 4 : CONFIG.ROCKS_PER_PLATFORM;

    for (const platform of level.groundPlatforms) {
      for (let i = 0; i < perPlatform; i++) {
        const img = images[Math.floor(Math.random() * images.length)];
        const w = img.width * scale;
        const h = img.height * scale;
        const minX = platform.x + margin;
        const maxX = platform.x + platform.width - w - margin;
        if (maxX <= minX) continue;
        const x = minX + Math.random() * (maxX - minX);
        const y = platform.y - h;
        // Сохраняем оригинальное изображение, масштаб и размеры
        this.list.push({ x, y, img, scale, w, h });
      }
    }
  },

  draw(ctx, camera) {
    for (const r of this.list) {
      const x = r.x - camera.x;
      const y = r.y - camera.y;
      if (x + r.w < 0 || x > canvas.width) continue;
      // Рисуем с масштабом
      ctx.drawImage(r.img, x, y, r.w, r.h);
    }
  },

  update() {}
};

window.decorations = decorations;