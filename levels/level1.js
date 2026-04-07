// // level1.js – данные первого уровня (модуль)
// import { Platform } from '../js/entities/platform.js';

// export const level1 = {
//   number: 1,
//   width: 3000,
//   height: 2000,
//   groundY: 1500,
//   skyColor: "#5c94fc",
//   wheelsData: [
//     { x: 620, y: 1380 - 32 },
//     { x: 660, y: 1380 - 32 },
//     { x: 920, y: 1340 - 32 },
//     { x: 1320, y: 1400 - 32 },
//     { x: 1360, y: 1400 - 32 },
//     { x: 1620, y: 1370 - 32 },
//     { x: 1920, y: 1340 - 32 },
//     { x: 2220, y: 1300 - 32 },
//     { x: 100, y: 1500 - 32 },
//     { x: 200, y: 1500 - 32 },
//     { x: 300, y: 1500 - 32 },
//     { x: 1300, y: 1500 - 32 },
//     { x: 1400, y: 1500 - 32 },
//     { x: 2300, y: 1500 - 32 },
//     { x: 2400, y: 1500 - 32 },
//     { x: 2500, y: 1500 - 32 },
//   ],
//   platformData: [
//     { x: 600, offset: 120, w: 200, h: 20 },
//     { x: 900, offset: 160, w: 200, h: 20 },
//     { x: 1300, offset: 100, w: 100, h: 20 },
//     { x: 1600, offset: 130, w: 200, h: 20 },
//     { x: 1900, offset: 160, w: 200, h: 20 },
//     { x: 2200, offset: 200, w: 70, h: 20 }
//   ],
//   platforms: [],
//   groundPlatforms: [],

//   getGroundBase() {
//     return this.groundY;
//   },

//   generate() {
//     this.platforms = [];
//     const base = this.getGroundBase();
//     for (const p of this.platformData) {
//       this.platforms.push(new Platform(p.x, base - p.offset, p.w, p.h));
//     }
//     this.groundPlatforms = [];
//     this.groundPlatforms.push(new Platform(0, base, 800, 200));
//     this.groundPlatforms.push(new Platform(1200, base, 800, 200));
//     this.groundPlatforms.push(new Platform(2200, base, 1100, 200));
//   }
// };