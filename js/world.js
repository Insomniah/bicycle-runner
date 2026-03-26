const world = {

    width: 3000,
    height: 2000,

    groundY: 1500, // базовый уровень земли

    groundPlatforms: [],

    // возвращает базовую линию земли
    getGroundBase() {
        return this.groundY;
    },

    // генерируем «физическую» землю как платформы
    generateGround() {
        console.log("GENERATE GROUND CALLED"); // ← логируем факт вызова
        
        const base = this.getGroundBase(); // ← объявляем ПЕРЕД использованием
        console.log("GROUND Y:", base);    // ← теперь безопасно логировать

        this.groundPlatforms = [];

        // Левая платформа (до первой ямы)
        this.groundPlatforms.push(
            new Platform(0, base, 800, 200)
        );

        // Средняя платформа (после первой ямы)
        this.groundPlatforms.push(
            new Platform(1200, base, 800, 200)
        );

        // Правая платформа (после второй ямы)
        this.groundPlatforms.push(
            new Platform(2200, base, 1200, 200)
        );
    },

    // рисуем визуальную землю, НЕ трогаем коллизии
    draw(ctx, camera) {
        ctx.fillStyle = "rgb(0,190,0)";
        ctx.beginPath();
        ctx.moveTo(-100, canvas.height);

        const step = 20 * getSceneScale();

        for (let x = -100; x < canvas.width + 100; x += step) {
            const worldX = x + camera.x;

            // для визуала берём базовую линию
            const worldY = this.getGroundBase();

            const screenY = worldY - camera.y;
            ctx.lineTo(x, screenY);
        }

        ctx.lineTo(canvas.width + 100, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

};

window.world = world; // экспортируем для доступа из других файлов