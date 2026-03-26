// ===============================
// Фоновые объекты
// ===============================
sky.generate();
mountains.generate();

// регистрируем слои
addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);

// Инициализация сцены
recalcScene();
initPlayerPosition(); // ставим игрока на землю после генерации уровня

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();

function gameLoop(time) {
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    const dt = (time - gameLoop.lastTime) / 1000;
    gameLoop.lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.update();
    updatePlayer(dt);

    // обновление и отрисовка фоновых слоёв
    sky.update();
    drawLayers(ctx, camera);

    // игрок
    drawPlayer(ctx, camera);

    // интерфейс
    drawUI();
    drawDebug();

    // проверка состояния игры
    if (gameOver) {
        drawGameOver(gameOver === "complete" ? "Stage complete" : "Game Over");
        requestAnimationFrame(gameLoop);
    } else {
        requestAnimationFrame(gameLoop);
    }
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
// Debug-информация
// ===============================
function drawDebug() {
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";

    let lines = [
        `PLAYER: x=${player.x.toFixed(1)}, y=${player.y.toFixed(1)}, vy=${player.vy.toFixed(2)}, onGround=${player.onGround}`,
        `MOVE: left=${player.moveLeft}, right=${player.moveRight}, auto=${player.autoMove}`,
        `PLATFORMS: level=${level1.platforms.length}, ground=${level1.groundPlatforms.length}`,
        `LEVEL SIZE: w=${level1.width}, h=${level1.height}`,
        `CAMERA: x=${camera.x.toFixed(1)}, y=${camera.y.toFixed(1)}`,
        `GAME: ${gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
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