// ===============================
// Предзагрузка всех изображений
// ===============================
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function loadAllImages() {
    const promises = [];

    // Спрайт игрока
    promises.push(
        loadImage("assets/player/player.png").then(img => {
            player.sprite = img;
        })
    );

    // Горы
    promises.push(
        loadImage("assets/mountains/mountains-bg.png").then(img => {
            mountains.img = img;
            mountains.loaded = true;
        })
    );

    // Камни (все типы)
    for (const type of rocks.rockTypes) {
        promises.push(
            loadImage(type.src).then(img => {
                rocks.images.push(img);
            })
        );
    }

    try {
        await Promise.all(promises);
        console.log("All images loaded");
        rocks.loaded = true;
    } catch (err) {
        console.error("Failed to load some images", err);
        // Можно показать сообщение пользователю, но не крашим игру
    }
}

// ===============================
// Инициализация мира и уровней
// ===============================
world.sky = sky;
world.mountains = mountains;

// Флаг для предотвращения повторного рестарта во время переключения
let restarting = false;

// Загружаем изображения, затем инициализируем игру
loadAllImages().then(() => {
    // Инициализируем первый уровень (внутри вызовутся level1.generate(), sky.generate(), mountains.generate())
    world.setLevel(level1);

    // Камни генерируются с уже загруженными изображениями
    rocks.generate();

    // Регистрируем объекты в слоях (один раз, они будут перерисовываться через свои draw методы)
    addToLayer("background", skyBackground);
    addToLayer("background", sky);
    addToLayer("background", mountains);
    addToLayer("midground", rocks);

    // Пересобираем сцену и позиционируем игрока
    recalcScene();

    // Запускаем игровой цикл
    requestAnimationFrame(gameLoop);
}).catch(err => {
    console.error("Critical error during image loading", err);
    // Можно вывести сообщение об ошибке в UI
});

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();
let nextLevelQueued = false;

function gameLoop(time) {
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    let dt = (time - gameLoop.lastTime) / 1000;
    // Ограничиваем dt, чтобы избежать больших скачков при низком FPS
    const maxDt = 0.033;
    if (dt > maxDt) dt = maxDt;
    gameLoop.lastTime = time;

    // Очищаем экран
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновления
    if (camera && camera.update) camera.update();
    if (window.updatePlayer) window.updatePlayer(dt);
    if (world && world.update) world.update();

    // Отрисовка слоёв и игрока
    drawLayers(ctx, camera);
    player.draw(ctx, camera);
    if (window.drawUI) drawUI();
    drawDebug();

    // Проверка конца уровня / игры
    if (gameOver) {
        if (gameOverUI && gameOverUI.show) gameOverUI.show(gameOver === "complete");

        if (gameOver === "complete" && !nextLevelQueued && !restarting) {
            nextLevelQueued = true;

            setTimeout(() => {
                console.log("Switching to level2...");
                world.setLevel(level2);
                rocks.generate();   // камни перегенерируются под новый уровень
                recalcScene();

                gameOver = false;
                nextLevelQueued = false;
                gameOverUI.hide();
            }, 2000);
        }
    }

    requestAnimationFrame(gameLoop);
}

// ===============================
// Отрисовка игрока
// ===============================


function restartLevel() {
    if (restarting) return; // уже выполняется рестарт
    restarting = true;

    try {
        if (!world.currentLevel) return;

        world.currentLevel.generate();
        rocks.generate();
        recalcScene();
        initPlayerPosition();

        player.autoMove = false;
        player.moveLeft = false;
        player.moveRight = false;

        gameOver = false;
        if (gameOverUI && gameOverUI.hide) gameOverUI.hide();
    } finally {
        restarting = false;
    }
}

// ===============================
// Debug-информация
// ===============================
function drawDebug() {
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";

    const level = world.currentLevel;
    if (!level) return;

    let lines = [
        `PLAYER: x=${player.x.toFixed(1)}, y=${player.y.toFixed(1)}, vy=${player.vy.toFixed(2)}, onGround=${player.onGround}`,
        `LEVEL: ${level.number} Size: ${level.width} X ${level.height}`,
        `GAME: ${gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
}