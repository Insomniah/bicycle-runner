const sky = {
    clouds: [],
    windSpeed: CONFIG.SKY_WIND_SPEED,

    generate() {
        this.clouds = [];
        const level = window.game.world.currentLevel;
        if (!level) return;
        const spacing = 200;
        const count = Math.ceil(level.width / spacing);
        const minY = 40;
        const maxY = canvas.height * 0.25;

        for (let i = 0; i < count; i++) {
            const size = 60 + Math.random() * 80;
            this.clouds.push({
                x: i * spacing + Math.random() * 200,
                y: minY + Math.random() * (maxY - minY),
                w: size,
                h: size * 0.4,
                parallax: CONFIG.SKY_PARALLAX
            });
        }
    },

    update() {
        const level = window.game.world.currentLevel;
        if (!level) return;
        for (const cloud of this.clouds) {
            cloud.x -= this.windSpeed;
            const limit = level.width + CONFIG.SKY_CLOUD_WRAP_MARGIN;
            if (cloud.x < -cloud.w) {
                cloud.x = limit;
            } else if (cloud.x > limit) {
                cloud.x = -cloud.w;
            }
        }
    },

    draw(ctx, camera) {
        ctx.fillStyle = "rgba(208,232,255,0.9)";
        for (const cloud of this.clouds) {
            const x = cloud.x - camera.x * cloud.parallax;
            if (x < -CONFIG.SKY_CLOUD_WRAP_MARGIN || x > canvas.width + CONFIG.SKY_CLOUD_WRAP_MARGIN) continue;
            const y = cloud.y;
            ctx.fillRect(x, y, cloud.w, cloud.h);
            ctx.fillRect(x + cloud.w * 0.3, y - cloud.h * 0.3, cloud.w * 0.6, cloud.h);
            ctx.fillRect(x + cloud.w * 0.6, y, cloud.w * 0.5, cloud.h);
        }
    }
};