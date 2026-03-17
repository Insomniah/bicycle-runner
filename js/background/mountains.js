const mountains = {

    list: [],

    // параллакс слоя
    parallax: 0.15,

    // типы скал
    rockTypes: [

        { src: "assets/rocks/middle_lane_rock1_1.png", sink: 22 },
        { src: "assets/rocks/middle_lane_rock1_2.png", sink: 12 },
        { src: "assets/rocks/middle_lane_rock1_3.png", sink: 6 }

    ],

    images: [],

    generate() {

        this.list = [];
        this.images = [];

        // загружаем картинки
        for (const type of this.rockTypes) {

            const img = new Image();
            img.src = type.src;

            this.images.push({
                img: img,
                sink: type.sink
            });

        }

        let x = 300;

        while (x < world.width) {

            // выбираем случайный тип скалы
            const type = this.images[
                Math.floor(Math.random() * this.images.length)
            ];

            this.list.push({
                x: x,
                img: type.img,
                sink: type.sink,
                scale: 0.8 + Math.random() * 0.4
            });

            // расстояние до следующей скалы
            const spacing = 250 + Math.random() * 100;

            x += spacing;

        }

    },

    draw(ctx, camera) {

        const groundBase = world.getGroundBase();

        for (const r of this.list) {

            const x = r.x - camera.x * this.parallax;

            // оптимизация: не рисуем вне экрана
            if (x < -400 || x > canvas.width + 400) continue;

            const w = r.img.width * r.scale;
            const h = r.img.height * r.scale;
            const y = groundBase - h + r.sink - camera.y;

            ctx.drawImage(
                r.img,
                x,
                y,
                w,
                h
            );

        }

    }

};