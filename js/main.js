// ===============================
// Инициализация мира и уровней
// ===============================
// Регистрируем объекты фона в мире (они будут использоваться при setLevel)
world.sky = sky;
world.mountains = mountains;
// Инициализируем первый уровень (внутри вызовутся level1.generate(), sky.generate(), mountains.generate())
world.setLevel(level1);
// Камни генерируются отдельно, так как они не привязаны к world.setLevel
rocks.generate();
// Регистрируем объекты в слоях (один раз, они будут перерисовываться через свои draw методы)
addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);
addToLayer("midground", rocks);
// Пересобираем сцену и позиционируем игрока
recalcScene();
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
    world.update();

    drawLayers(ctx, camera);
    drawPlayer(ctx, camera);
    drawUI();
    drawDebug();

    if (gameOver) {
        gameOverUI.show(gameOver === "complete");

        if (gameOver === "complete" && !nextLevelQueued) {
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
function drawPlayer(ctx, camera) {
    if (!player.sprite) return;

    ctx.save();

    const drawX = player.x - camera.x;
    const drawY = player.y - camera.y;

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

    world.currentLevel.generate();
    rocks.generate();
    recalcScene();
    initPlayerPosition();

    player.autoMove = false;
    player.moveLeft = false;
    player.moveRight = false;

    gameOver = false;
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