const world = {

    width: 10000,

    getGroundBase() {

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