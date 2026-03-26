// mountains.js — дальний фон, апскейленные "горы"

const mountains = {

    list: [],

    // параллакс слоя
    parallax: 0.15,

    // типы скал (будем апскейлить)
    rockTypes: [
        "assets/rocks/middle_lane_rock1_1.png",
        "assets/rocks/middle_lane_rock1_2.png",
        "assets/rocks/middle_lane_rock1_3.png"
    ],

    images: [],

    generate() {
        this.list = [];
        this.images = [];

        // загружаем картинки
        for (const src of this.rockTypes) {
            const img = new Image();
            img.src = src;
            this.images.push(img);
        }

        let x = 300;
        const level = world.currentLevel;

        while (x < level.width) {
            // случайная картинка
            const img = this.images[Math.floor(Math.random() * this.images.length)];

            this.list.push({
                x: x,
                img: img,
                scale: 2 + Math.random() * 0.5 // апскейлим в ~3 раза
            });

            // расстояние до следующей "горы"
            const spacing = 250 + Math.random() * 100;
            x += spacing;
        }
    },

    draw(ctx, camera) {

        for (const r of this.list) {
            const x = r.x - camera.x * this.parallax;

            // оптимизация: не рисуем вне экрана
            if (x < -400 || x > canvas.width + 400) continue;

            const w = r.img.width * r.scale;
            const h = r.img.height * r.scale;

            // привязка к низу экрана
            const y = canvas.height - h;

            ctx.drawImage(r.img, x, y, w, h);
        }
    }

};

window.mountains = mountains;