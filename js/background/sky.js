const sky = {
    clouds: [],
    windSpeed: 0.2, // скорость движения облаков (px за кадр)

    generate() {
        this.clouds = [];

        const spacing = 200;
        const count = Math.ceil(world.width / spacing);
        const minY = 40;
        const maxY = canvas.height * 0.25;

        for (let i = 0; i < count; i++) {
            const size = 60 + Math.random() * 80;
            this.clouds.push({
                x: i * spacing + Math.random() * 200,
                y: minY + Math.random() * (maxY - minY),
                w: size,
                h: size * 0.4,
                parallax: 0.2
            });
        }
    },

    update() {
        for (const cloud of this.clouds) {
            cloud.x -= this.windSpeed;

            // если облако ушло за правый край уровня, возвращаем в начало
            if (cloud.x > world.width + 300) {
                cloud.x = -cloud.w; 
            }
        }
    },

    draw(ctx, camera) {
        ctx.fillStyle = "rgba(208,232,255,0.9)";
        for (const cloud of this.clouds) {
            const x = cloud.x - camera.x * cloud.parallax;
            if (x < -300 || x > canvas.width + 300) continue;
            const y = cloud.y;

            ctx.fillRect(x, y, cloud.w, cloud.h);
            ctx.fillRect(x + cloud.w * 0.3, y - cloud.h * 0.3, cloud.w * 0.6, cloud.h);
            ctx.fillRect(x + cloud.w * 0.6, y, cloud.w * 0.5, cloud.h);
        }
    }
};