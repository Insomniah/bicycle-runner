const level1 = {
    number: 1,
    width: 3000,    // ширина уровня
    height: 2000,   // высота уровня
    groundY: 1500,  // базовая линия земли

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