// level2.js – данные второго уровня (с заводским фоном)

const level2 = {
  number: 2,
  width: 2000,
  height: 2000,
  groundY: 1500,
    skyColor: "#788aad",
// можно даже "#6983b4"
  // Фон для этого уровня (заводы)
  backgroundImage: CONFIG.BACKGROUND_FACTORIES,

  platformData: [
    { x: 400, offset: 120, w: 200, h: 20 },
    { x: 800, offset: 160, w: 200, h: 20 },
    { x: 1200, offset: 100, w: 100, h: 20 },
    { x: 1600, offset: 130, w: 200, h: 20 }
  ],

  wheelsData: [
    // Платформы level2
    { x: 420, y: 1380 - 32 },
    { x: 820, y: 1340 - 32 },
    { x: 1220, y: 1400 - 32 },
    { x: 1620, y: 1370 - 32 },
    // Земля level2
    { x: 100, y: 1500 - 32 },
    { x: 200, y: 1500 - 32 },
    { x: 900, y: 1500 - 32 },
    { x: 1000, y: 1500 - 32 },
    { x: 1700, y: 1500 - 32 },
    { x: 1800, y: 1500 - 32 },
    { x: 1900, y: 1500 - 32 },
    { x: 2000, y: 1500 - 32 },
  ],

  platforms: [],
  groundPlatforms: [],

  getGroundBase() {
    return this.groundY;
  },

  generate() {
    this.platforms = [];
    const base = this.getGroundBase();
    for (const p of this.platformData) {
      this.platforms.push(new Platform(p.x, base - p.offset, p.w, p.h));
    }

    this.groundPlatforms = [];
    this.groundPlatforms.push(new Platform(0, base, 600, 200));
    this.groundPlatforms.push(new Platform(800, base, 600, 200));
    this.groundPlatforms.push(new Platform(1600, base, 800, 200));
  }
};

window.level2 = level2;