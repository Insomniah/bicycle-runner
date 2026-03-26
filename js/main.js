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
    if (!window.DEBUG) return;

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";

    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;

    ctx.fillText(`player.x: ${player.x.toFixed(1)}`, 10, 20);
    ctx.fillText(`player.y: ${player.y.toFixed(1)}`, 10, 40);

    ctx.fillText(`screenX: ${screenX.toFixed(1)}`, 10, 60);
    ctx.fillText(`screenY: ${screenY.toFixed(1)}`, 10, 80);

    ctx.fillText(`camera.y: ${camera.y.toFixed(1)}`, 10, 100);

    ctx.fillText(`vy: ${player.vy.toFixed(2)}`, 10, 140);
    ctx.fillText(`onGround: ${player.onGround}`, 10, 160);

    ctx.restore();
}