const world = {

    width: 3000,
    height: 2000,

    groundY: 1500, // ← ВОЗВРАЩАЕМ, но уже правильно

    getGroundBase() {
        return this.groundY;
    },

    groundHeight(x) {

        const base = this.getGroundBase();

        // ===== ЯМА =====
        if (x > 800 && x < 1200) {
            return base + 1000; // "дыра вниз"
        }

        return base;
    },

    draw(ctx, camera) {

        ctx.fillStyle = "rgb(0,190,0)";
        ctx.beginPath();

        // начинаем слева за экраном
        ctx.moveTo(-100, canvas.height);

        const step = 20 * getSceneScale();

        for (let x = -100; x < canvas.width + 100; x += step) {

            const worldX = x + camera.x;

            // высота земли в МИРОВЫХ координатах
            const worldY = this.groundHeight(worldX);

            // перевод в экран
            const screenY = worldY - camera.y;

            ctx.lineTo(x, screenY);

        }

        ctx.lineTo(canvas.width + 100, canvas.height);
        ctx.closePath();
        ctx.fill();

    }

};