// генерируем фоновые объекты
sky.generate();
mountains.generate();

// регистрируем слои

addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);

recalcScene(); // Инициализация сцены

// основной игровой цикл
let lastTime = performance.now();

function gameLoop(time) {
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    const dt = (time - gameLoop.lastTime) / 1000;
    gameLoop.lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.update();
    updatePlayer(dt);
    sky.update();
    drawLayers(ctx, camera);
    drawPlayer();
    drawUI();

    drawDebug();

    if (gameOver) {
        drawGameOver(gameOver === "complete" ? "Stage complete" : "Game Over");
        // оставляем игрока уходить за край, не останавливаем requestAnimationFrame
        requestAnimationFrame(gameLoop);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// старт цикла
requestAnimationFrame(gameLoop);

// экран окончания игры
function drawGameOver(text) {

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

}

function drawDebug() {
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";

    let lines = [
        `PLAYER: x=${player.x.toFixed(1)}, y=${player.y.toFixed(1)}, vy=${player.vy.toFixed(2)}, onGround=${player.onGround}`,
        `MOVE: left=${player.moveLeft}, right=${player.moveRight}, auto=${player.autoMove}`,
        `PLATFORMS: count=${level1.platforms.length}`,
        `WORLD: w=${world.width}, h=${world.height}`,
        `GAME: ${gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
}