const world = {

    width: 10000,

    getGroundBase() {

        const scale = getSceneScale();

        // Земля примерно на 66% высоты экрана
        // Масштаб сцены немного корректирует позицию,
        // чтобы на маленьких экранах земля не уползала вниз
        return canvas.height * (0.60 + 0.06 * scale);

    },

    groundHeight(x) {

        // временно ровная земля
        return this.getGroundBase();

    },

    draw(ctx, camera) {

        // Рисуем землю (зелёную поверхность)
        ctx.fillStyle = "rgb(0, 190, 0)";

        ctx.beginPath();

        // начинаем слева за экраном
        ctx.moveTo(-100, canvas.height);

        // идём по всей ширине экрана
        const step = 20 * getSceneScale();

        for (let x = -100; x < canvas.width + 100; x += step) {

            const worldX = x + camera.x;
            const y = this.groundHeight(worldX);

            ctx.lineTo(x, y);

        }

        // закрываем землю вниз
        ctx.lineTo(canvas.width + 100, canvas.height);
        ctx.closePath();

        ctx.fill();

    }

};