const level2 = {
    number: 2,
    width: 2000,
    height: 2000,
    groundY: 1500,

    platformData: [
        { x: 400, offset: 120, w: 200, h: 20 },
        { x: 800, offset: 160, w: 200, h: 20 },
        { x: 1200, offset: 100, w: 100, h: 20 },
        { x: 1600, offset: 130, w: 200, h: 20 }
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

        // создаём физическую землю (три платформы с пропусками)
        this.groundPlatforms = [];
        this.groundPlatforms.push(new Platform(0, base, 600, 200));
        this.groundPlatforms.push(new Platform(800, base, 600, 200));
        this.groundPlatforms.push(new Platform(1600, base, 600, 200));
    }
};

window.level2 = level2;