// =====================================
// СКАЛЫ (спрайтовый фон)
// =====================================

const mountains = {

    images: [],
    list: [],


    // загрузка текстур
    load() {

        const files = [

            "assets/rocks/middle_lane_rock1_1.png",
            "assets/rocks/middle_lane_rock1_2.png",
            "assets/rocks/middle_lane_rock1_3.png",
        ];

        for (const src of files) {

            const img = new Image();
            img.src = src;

            this.images.push(img);

        }

    },


    // генерация скал по миру
    generate() {

        this.list = [];

        let x = 0;

        const minGap = 180;
        const maxGap = 550;

        while (x < world.width) {

            const img = this.images[
                Math.floor(Math.random() * this.images.length)
            ];

            this.list.push({
                x: x,
                img: img
            });

            const gap = minGap + Math.random() * (maxGap - minGap);

            x += gap;

        }

    },


    draw(ctx, camera) {

        const parallax = 0.15;

        for (const r of this.list) {

            if (!r.img.complete) continue;

            const screenX = r.x - camera.x * parallax;

            if (screenX < -500 || screenX > canvas.width + 500) continue;

            // получаем высоту земли в этой точке
            const groundY = world.groundHeight(r.x);

            // ставим скалу на землю
            const y = groundY - r.img.height + 42;

            ctx.drawImage(
                r.img,
                screenX,
                y
            );

        }

    }

};