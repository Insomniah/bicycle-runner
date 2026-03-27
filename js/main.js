// ===============================
// Инициализация уровней и мира
// ===============================
level1.generate();
level2.generate();

// ставим текущий уровень
world.currentLevel = level1;

// генерируем фоновые объекты
sky.generate();
mountains.generate();
rocks.generate();

// РЕГИСТРИРУЕМ В WORLD
world.sky = sky;
world.mountains = mountains;

// регистрируем слои
addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);
addToLayer("midground", rocks);

// инициализация сцены и игрока
recalcScene();
initPlayerPosition(); // ставим игрока на землю после генерации уровня

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();
let nextLevelQueued = false;

// Кнопка "Restart" (появляется при Game Over)
let restartButton = {
    x: 0,
    y: 0,
    w: 200,
    h: 60,
    visible: false
};

function gameLoop(time) {
    // вычисляем dt
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    const dt = (time - gameLoop.lastTime) / 1000;
    gameLoop.lastTime = time;

    // очищаем экран
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // обновляем камеру и игрока
    camera.update();
    window.updatePlayer(dt);

    // обновляем мир
    world.update();

    // отрисовка слоёв и игрока
    drawLayers(ctx, camera);
    drawPlayer(ctx, camera);
    drawUI();
    drawDebug();

    // ===============================
    // Проверка конца уровня / игры
    // ===============================
    if (gameOver) {
        // показываем UI через gameOverUI
        gameOverUI.show(gameOver === "complete");

        // если уровень завершён и ещё не запущена смена уровня
        if (gameOver === "complete" && !nextLevelQueued) {
            nextLevelQueued = true;

            setTimeout(() => {
                console.log("Switching to level2...");
                
                // смена уровня
                world.setLevel(level2);

                // пересоздаём объекты текущего уровня
                rocks.generate();
                recalcScene();
                initPlayerPosition();

                // сброс состояния игры
                gameOver = false;
                nextLevelQueued = false;

                gameOverUI.hide();
            }, 2000);
        }
    }

    // один вызов анимации в конце функции
    requestAnimationFrame(gameLoop);
}

// ===============================
// Отрисовка игрока
// ===============================
function drawPlayer(ctx, camera) {
    if (!player.sprite) return;

    ctx.save();

    const drawX = player.x - camera.x;
    const drawY = player.y - camera.y;

    // отражение влево
    if (player.moveLeft) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            player.sprite,
            player.frameX * player.frameWidth,
            0,
            player.frameWidth,
            player.frameHeight,

            -drawX - player.width,
            drawY,
            player.width,
            player.height
        );
    } else {
        ctx.drawImage(
            player.sprite,
            player.frameX * player.frameWidth,
            0,
            player.frameWidth,
            player.frameHeight,

            drawX,
            drawY,
            player.width,
            player.height
        );
    }

    ctx.restore();
}

function restartLevel() {
    if (!world.currentLevel) return;

    // пересоздаём объекты текущего уровня
    world.currentLevel.generate();
    rocks.generate();

    // пересобираем слои и объекты сцены
    recalcScene();

    // ставим игрока на стартовую позицию
    initPlayerPosition();

    // сбрасываем состояние игры
    gameOver = false;

    // прячем Game Over UI
    gameOverUI.hide();
}
// ===============================
// Старт цикла
// ===============================
requestAnimationFrame(gameLoop);

// ===============================
// Debug-информация
// ===============================
function drawDebug() {
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";

    const level = world.currentLevel;

    let lines = [
        `PLAYER: x=${player.x.toFixed(1)}, y=${player.y.toFixed(1)}, vy=${player.vy.toFixed(2)}, onGround=${player.onGround}`,
        `LEVEL: ${level ? level.number + " Size: " + level.width + " X " + level.height : "none"}`,
        `GAME: ${gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
}