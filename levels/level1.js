const level1 = {
    number: 1,
    width: 3000,    // ширина уровня
    height: 2000,   // высота уровня
    groundY: 1500,  // базовая линия земли

    wheelsData: [

        { x: 620, y: 1380 - 32 },
        { x: 660, y: 1380 - 32 },
        // Платформа 2 (x=900, y=1500-160=1340)
        { x: 920, y: 1340 - 32 },
        // Платформа 3 (x=1300, y=1500-100=1400)
        { x: 1320, y: 1400 - 32 },
        { x: 1360, y: 1400 - 32 },
        // Платформа 4 (x=1600, y=1500-130=1370)
        { x: 1620, y: 1370 - 32 },
        // Платформа 5 (x=1900, y=1500-160=1340)
        { x: 1920, y: 1340 - 32 },
        // Платформа 6 (x=2200, y=1500-200=1300)
        { x: 2220, y: 1300 - 32 },
        // Земля (левая часть: x=0-800, y=1500)
        { x: 100, y: 1500 - 32 },
        { x: 200, y: 1500 - 32 },
        { x: 300, y: 1500 - 32 },
        // Земля (средняя часть: x=1200-2000, y=1500)
        { x: 1300, y: 1500 - 32 },
        { x: 1400, y: 1500 - 32 },
        // Земля (правая часть: x=2200-3300, y=1500)
        { x: 2300, y: 1500 - 32 },
        { x: 2400, y: 1500 - 32 },
        { x: 2500, y: 1500 - 32 },
    ],

    // платформы уровня
    platformData: [
        { x: 600, offset: 120, w: 200, h: 20 },
        { x: 900, offset: 160, w: 200, h: 20 },
        { x: 1300, offset: 100, w: 100, h: 20 },
        { x: 1600, offset: 130, w: 200, h: 20 },
        { x: 1900, offset: 160, w: 200, h: 20 },
        { x: 2200, offset: 200, w: 70, h: 20 }
    ],
    platforms: [],       // обычные платформы
    groundPlatforms: [], // «земля» — платформы с пропусками

    getGroundBase() {
        return this.groundY;
    },

    generate() {
        // создаём платформы уровня
        this.platforms = [];
        const base = this.getGroundBase();
        for (const p of this.platformData) {
            this.platforms.push(
                new Platform(p.x, base - p.offset, p.w, p.h)
            );
        }

        // создаём физическую землю (три платформы с пропусками)
        this.groundPlatforms = [];
        this.groundPlatforms.push(new Platform(0, base, 800, 200));       // левая
        this.groundPlatforms.push(new Platform(1200, base, 800, 200));    // средняя
        this.groundPlatforms.push(new Platform(2200, base, 1100, 200));    // правая

    }
    
};

window.level1 = level1;