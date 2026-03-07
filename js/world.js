const world = {

    width: 10000,

    groundHeight(x) {

        const base = canvas.height - 120;
        const hill = Math.sin(x * 0.002) * 50;

        return base - hill;
    },

    drawSky(ctx, camera) {

        const ground = canvas.height - 120;

        // дальние облака
        ctx.fillStyle = "#a0c8ff";

        for (let i = 0; i < 10; i++) {

            const x =
                ((i * 600 - camera.x * 0.2) % (canvas.width + 600) +
                    canvas.width +
                    600) %
                (canvas.width + 600);

            ctx.fillRect(x, ground - 320, 200, 60);
        }

        // ближние облака
        ctx.fillStyle = "#d0e8ff";

        for (let i = 0; i < 10; i++) {

            const x =
                ((i * 400 - camera.x * 0.4) % (canvas.width + 400) +
                    canvas.width +
                    400) %
                (canvas.width + 400);

            ctx.fillRect(x, ground - 240, 150, 50);
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