// background/rocks.js

const rocks = {

    list: [],

    rockTypes: [
        { src: "assets/rocks/middle_lane_rock1_1.png" },
        { src: "assets/rocks/middle_lane_rock1_2.png" },
        { src: "assets/rocks/middle_lane_rock1_3.png" },
        { src: "assets/rocks/middle_lane_rock1_4.png" },
        { src: "assets/rocks/middle_lane_rock1_5.png" }
    ],

    images: [],
    loaded: false,

    generate() {
        this.list = [];

        // если ещё не загрузили картинки — грузим один раз
        if (!this.images.length) {
            let loadedCount = 0;

            for (const type of this.rockTypes) {
                const img = new Image();
                img.src = type.src;

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === this.rockTypes.length) {
                        this.loaded = true;
                        this.generate(); // повторный запуск после загрузки
                    }
                };

                this.images.push(img);
            }

            return; // ждём загрузку
        }

        if (!this.loaded) return;

        const level = world.currentLevel;
        if (!level || !level.groundPlatforms) return;

        const margin = 10; // отступ от краёв платформы, чтобы камни не были "на самом краю"
        // для каждой платформы генерируем несколько камней
        for (const platform of level.groundPlatforms) {

            for (let i = 0; i < 4; i++) {

                const img = this.images[Math.floor(Math.random() * this.images.length)];

                const w = img.width;
                const h = img.height;

                // ВАЖНО: учитываем ОБА края
                const minX = platform.x + margin;
                const maxX = platform.x + platform.width - w - margin;

                if (maxX <= minX) continue;

                const x = minX + Math.random() * (maxX - minX);
                const y = platform.y - h;

                this.list.push({
                    x,
                    y,
                    img
                });
            }
        }
    },

    draw(ctx, camera) {
        for (const r of this.list) {

            const x = r.x - camera.x;
            const y = r.y - camera.y;

            if (x + r.img.width < 0 || x > canvas.width) continue;

            ctx.drawImage(r.img, x, y);
        }
    },

    update() {}

};

window.rocks = rocks;