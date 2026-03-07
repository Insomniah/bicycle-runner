const world = {

    width: 10000,
    clouds: [],

    generateClouds() {

        this.clouds = [];

        const spacing = 400;
        const count = Math.ceil(this.width / spacing);

        for (let i = 0; i < count; i++) {

            const size = 60 + Math.random() * 180; // минимальный и максимальный размер облаков

            this.clouds.push({

                x: i * spacing + Math.random() * 200,
                y: 60 + Math.random() * 80,

                w: size,
                h: size * 0.4,

                parallax: 0.2

            });

        }

    },

    groundHeight(x) {

        const base = canvas.height - 120;
        const hill = Math.sin(x * 0.002) * 50;

        return base - hill;
    },

    drawSky(ctx, camera) {

        ctx.fillStyle = "rgba(208,232,255,0.9)";

        for (const cloud of this.clouds) {

            const x = cloud.x - camera.x * cloud.parallax;

            if (x < -300 || x > canvas.width + 300) continue;

            const y = cloud.y;

            ctx.fillRect(x, y, cloud.w, cloud.h);
            ctx.fillRect(x + cloud.w * 0.3, y - cloud.h * 0.3, cloud.w * 0.6, cloud.h);
            ctx.fillRect(x + cloud.w * 0.6, y, cloud.w * 0.5, cloud.h);

        }

    },

    draw(ctx, camera) {

        ctx.fillStyle = "#228B22";

        for (let x = camera.x; x < camera.x + canvas.width; x += 10) {

            const y = this.groundHeight(x);

            ctx.fillRect(
                x - camera.x,
                y,
                10,
                canvas.height - y
            );
        }
    }
};