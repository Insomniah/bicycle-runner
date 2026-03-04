function drawBackground() {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // пример рельефа
    ctx.fillStyle = "#228B22";
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(200 * i, canvas.height - 50, 150, 50);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    ctx.save();
    ctx.translate(-camera.x, 0);

    updatePlayer();
    drawPlayer();

    ctx.restore();

    drawUI(); // интерфейс управления для мобилы

    requestAnimationFrame(gameLoop);
}

gameLoop();