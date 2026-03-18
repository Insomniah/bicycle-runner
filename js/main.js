// генерируем фоновые объекты
sky.generate();
mountains.generate();

// регистрируем слои

addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);
addToLayer("world", world);

// генерируем уровень
level1.generate();
// добавляем платформы уровня

for (const p of level1.platforms) {
    addToLayer("world", p);
}


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