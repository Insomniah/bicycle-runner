const world = {

    width: 3000, // ширина мира
    height: 2000, // высота мира (для генерации платформ и т.п.)
    groundY: 1500,// базовая высота земли

    getGroundBase() {
        return this.groundY; // в будущем можно будет сделать рельеф, а пока просто базовая линия
    },

    groundHeight(x) {

        // пока земля ровная
        return this.getGroundBase();

    },
    // отрисовка земли
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