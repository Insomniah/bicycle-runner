// scenery/decorations.js – камни и шины (модуль) с чистой функцией генерации

// Чистая функция: генерирует список декораций на основе параметров
export function generateDecorationsList(groundPlatforms, isLevel2, rockImages, tireImages, config) {
  const list = [];
  const images = isLevel2 ? tireImages : rockImages;
  if (!images.length) return list;

  const scale = isLevel2 ? 0.2 : 1;
  const margin = config.ROCKS_MARGIN;
  const perPlatform = isLevel2 ? 4 : config.ROCKS_PER_PLATFORM;

  for (const platform of groundPlatforms) {
    for (let i = 0; i < perPlatform; i++) {
      const img = images[Math.floor(Math.random() * images.length)];
      const w = img.width * scale;
      const h = img.height * scale;
      const minX = platform.x + margin;
      const maxX = platform.x + platform.width - w - margin;
      if (maxX <= minX) continue;
      const x = minX + Math.random() * (maxX - minX);
      const y = platform.y - h;
      list.push({ x, y, img, scale, w, h });
    }
  }
  return list;
}

// Объект декораций (мутабельный, но использует чистую функцию)
export const decorations = {
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
    const level = window.game.world.currentLevel;
    if (!level || !level.groundPlatforms) return;
    const isLevel2 = (level.number === 2);
    const images = isLevel2 ? this.tireImages : this.rockImages;
    if (!images.length) return;
    this.list = generateDecorationsList(level.groundPlatforms, isLevel2, this.rockImages, this.tireImages, CONFIG);
  },

  draw(ctx, camera) {
    for (const r of this.list) {
      const x = r.x - camera.x;
      const y = r.y - camera.y;
      if (x + r.w < 0 || x > canvas.width) continue;
      ctx.drawImage(r.img, x, y, r.w, r.h);
    }
  },

  update() {}
};

// Для обратной совместимости
window.decorations = decorations;