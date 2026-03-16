const level1 = {

    platformData: [

        { x: 600, offset: 120, w: 200, h: 20 },
        { x: 900, offset: 160, w: 200, h: 20 },
        { x: 1300, offset: 100, w: 100, h: 20 },
        { x: 1600, offset: 130, w: 200, h: 20 },
        { x: 1900, offset: 160, w: 200, h: 20 },
        { x: 2200, offset: 200, w: 70, h: 20 }

    ],

    platforms: [],

    generate() {

        this.platforms = [];

        const ground = world.getGroundBase();

        for (const p of this.platformData) {

            this.platforms.push(
                new Platform(
                    p.x,
                    ground - p.offset,
                    p.w,
                    p.h
                )
            );

        }

    }

};

window.level1 = level1;