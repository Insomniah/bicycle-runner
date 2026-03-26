const rocks = {

    list: [],

    rockTypes: [
        { src: "assets/rocks/middle_lane_rock1_1.png", sink: 22 },
        { src: "assets/rocks/middle_lane_rock1_2.png", sink: 12 },
        { src: "assets/rocks/middle_lane_rock1_3.png", sink: 6 }
    ],

    images: [],

    generate() {
        this.list = [];
        this.images = [];

        const level = world.currentLevel;
        if (!level) return;

        // загрузка картинок
        for (const type of this.rockTypes) {
            const img = new Image();
            img.src = type.src;
            this.images.push({ img: img, sink: type.sink });
        }

        // ПРОХОД ПО ЗЕМЛЕ
        for (const ground of level.groundPlatforms) {

            let x = ground.x;

            while (x < ground.x + ground.width) {

                // случайный пропуск
                if (Math.random() < 0.4) {
                    x += 100;
                    continue;
                }

                const type = this.images[Math.floor(Math.random() * this.images.length)];

                const scale = 0.8 + Math.random() * 0.4;

                this.list.push({
                    x: x,
                    baseY: ground.y, // 👈 ключевая привязка
                    img: type.img,
                    sink: type.sink,
                    scale: scale
                });

                x += 120 + Math.random() * 80;
            }
        }
    },

    draw(ctx, camera) {

        for (const r of this.list) {

            const w = r.img.width * r.scale;
            const h = r.img.height * r.scale;

            const x = r.x - camera.x;
            const y = r.baseY - h + r.sink - camera.y;

            // оптимизация
            if (x < -200 || x > canvas.width + 200) continue;

            ctx.drawImage(r.img, x, y, w, h);
        }
    }
};

window.rocks = rocks;