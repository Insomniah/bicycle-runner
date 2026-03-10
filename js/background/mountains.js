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