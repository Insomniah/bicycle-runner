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
        gameOverUI.show(gameOver === "complete");

        if (gameOver === "complete" && !nextLevelQueued) {
            nextLevelQueued = true;
            setTimeout(() => {
                world.setLevel(level2);
                rocks.generate();
                recalcScene();
                initPlayerPosition();
                gameOver = false;
                nextLevelQueued = false;
                gameOverUI.hide();
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

// ===============================
// Экран окончания игры
// ===============================
// function drawGameOver(text) {
//     ctx.fillStyle = "rgba(0,0,0,0.7)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     ctx.fillStyle = "white";
//     ctx.font = "48px Arial";
//     ctx.textAlign = "center";

//     ctx.fillText(text, canvas.width / 2, canvas.height / 2);

//     // ===== КНОПКА РЕСТАРТ =====
//     if (gameOver === "fail") {
//         restartButton.w = 200;
//         restartButton.h = 60;
//         restartButton.x = canvas.width / 2 - restartButton.w / 2;
//         restartButton.y = canvas.height / 2 + 60;
//         restartButton.visible = true;

//         ctx.fillStyle = "#222";
//         ctx.fillRect(restartButton.x, restartButton.y, restartButton.w, restartButton.h);

//         ctx.fillStyle = "white";
//         ctx.font = "24px Arial";
//         ctx.fillText("RESTART", canvas.width / 2, restartButton.y + 40);
//     } else {
//         restartButton.visible = false;
//     }
// }
// 
function restartLevel() {
    // переставляем игрока и пересобираем сцену
    if (!world.currentLevel) return;

    // пересоздаём платформы и объекты текущего уровня
    world.currentLevel.generate();

    // пересоздаём ближние скалы
    rocks.generate();

    // пересобираем слои и объекты на сцене
    recalcScene();

    // ставим игрока на землю после генерации уровня
    initPlayerPosition();

    // сбрасываем состояние игры
    gameOver = false;
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