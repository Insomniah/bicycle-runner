const world = {

    width: 10000,

    getGroundBase() {

        // мобильный экран ниже → опускаем землю
        if (canvas.height < 500) {
            return canvas.height - 60;
        }

        return canvas.height - 120;

    },

    groundHeight(x) {

        const base = this.getGroundBase();
        const hill = Math.sin(x * 0.002) * 50;

        return base - hill;

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



const sky = {

    clouds: [],

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



const mountains = {

    list: [],

    generate() {

        this.list = [];

        const spacing = 400;
        const count = Math.ceil(world.width / spacing);

        for (let i = 0; i < count; i++) {

            const peaks = [];
            const peakCount = 3 + Math.floor(Math.random() * 2);

            for (let p = 0; p < peakCount; p++) {

                peaks.push({
                    x: p * 120 + Math.random() * 60,
                    h: 80 + Math.random() * 140
                });

            }

            this.list.push({

                x: i * spacing + Math.random() * 200,
                width: peakCount * 120,
                peaks: peaks

            });

        }

    },

    draw(ctx, camera) {

        const parallax = 0.05;
        const baseY = world.getGroundBase();

        ctx.fillStyle = "#6c8ed6";

        for (const m of this.list) {

            const x = m.x - camera.x * parallax;

            if (x < -600 || x > canvas.width + 600) continue;

            ctx.beginPath();
            ctx.moveTo(x, baseY);

            for (const peak of m.peaks) {

                ctx.lineTo(
                    x + peak.x,
                    baseY - peak.h
                );

            }

            ctx.lineTo(x + m.width, baseY);

            ctx.closePath();
            ctx.fill();

        }

    }

};