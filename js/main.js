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

// регистрируем слои
addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);

// инициализация сцены и игрока
recalcScene();
initPlayerPosition(); // ставим игрока на землю после генерации уровня

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();
let nextLevelQueued = false;

function gameLoop(time) {
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    const dt = (time - gameLoop.lastTime) / 1000;
    gameLoop.lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.update();
    window.updatePlayer(dt);

    // обновляем фон и мир
    world.update();

    drawLayers(ctx, camera);
    drawPlayer(ctx, camera);
    drawUI();
    drawDebug();

    // ===============================
    // Проверка конца уровня / игры
    // ===============================
    if (gameOver) {
        drawGameOver(gameOver === "complete" ? "Stage complete" : "Game Over");

        if (gameOver === "complete" && !nextLevelQueued) {
            nextLevelQueued = true;

            setTimeout(() => {
                console.log("Switching to level2...");
                // переключаем текущий уровень
                world.setLevel(level2);
                // ПЕРЕСТРОИТЬ СЦЕНУ
                recalcScene();

                gameOver = false;
                nextLevelQueued = false;
            }, 2000);
        }

        requestAnimationFrame(gameLoop);
        return;
    }

    requestAnimationFrame(gameLoop);
}

// ===============================
// Отрисовка игрока
// ===============================
function drawPlayer(ctx, camera) {
    ctx.fillStyle = "lime";
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
}

// ===============================
// Экран окончания игры
// ===============================
function drawGameOver(text) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
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
        `LEVEL: ${level ? "№" + level.number + " w=" + level.width + ", h=" + level.height : "none"}`,
        `GAME: ${gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
}