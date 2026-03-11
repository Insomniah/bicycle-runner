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

        const base = this.getGroundBase();
        const scale = getSceneScale();

        // Небольшие холмы через синус
        const hill = Math.sin(x * 0.002) * 50 * scale;

        // Земля поднимается и опускается относительно базовой линии
        return base - hill;

    },

    draw(ctx, camera) {

        // Рисуем землю (зелёную поверхность)
        ctx.fillStyle = "#15803d";

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