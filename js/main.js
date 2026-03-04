function drawBackground() {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // земля
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, groundLevel(), canvas.width, canvas.height - groundLevel());
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    if (!gameOver) {
        ctx.save();
        ctx.translate(-camera.x, 0);

        updatePlayer();
        drawPlayer();

        ctx.restore();

        drawUI();
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

gameLoop();

function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.font = "24px Arial";
    ctx.fillText("Обнови страницу, чтобы начать заново",
        canvas.width / 2,
        canvas.height / 2 + 50);
}