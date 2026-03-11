const world = {

    width: 10000,

    getGroundBase() {

        // Земля примерно на 66% высоты экрана
        // Это работает одинаково хорошо на телефонах и на десктопе
        return canvas.height * 0.66;

    },

    groundHeight(x) {

        const base = this.getGroundBase();

        // Небольшие холмы через синус
        const hill = Math.sin(x * 0.002) * 50;

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
        for (let x = -100; x < canvas.width + 100; x += 20) {

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