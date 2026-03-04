const world = {
    width: 10000,

    groundHeight(x) {
        // Простой рельеф
        const base = canvas.height - 100;
        const hill = Math.sin(x * 0.002) * 50;
        return base - hill;
    },

    draw(ctx, camera) {

        // Небо уже фон canvas

        // Земля
        ctx.fillStyle = "#228B22";

        for (let x = camera.x; x < camera.x + canvas.width; x += 5) {
            const y = this.groundHeight(x);
            ctx.fillRect(x - camera.x, y, 5, canvas.height - y);
        }
    }
};