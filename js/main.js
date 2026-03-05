function drawBackground() {
    // базовое небо
    ctx.fillStyle = "#5c94fc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // дальние облака (медленный слой)
    ctx.fillStyle = "#a0c8ff";
    for (let i = 0; i < 10; i++) {
        const x = (i * 600 - camera.x * 0.2) % (canvas.width + 600);
        ctx.fillRect(x, 100, 200, 60);
    }

    // ближние облака (быстрее двигаются)
    ctx.fillStyle = "#d0e8ff";
    for (let i = 0; i < 10; i++) {
        const x = (i * 400 - camera.x * 0.4) % (canvas.width + 400);
        ctx.fillRect(x, 200, 150, 50);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    if (!gameOver) {
        ctx.save();
        ctx.translate(-camera.x, 0);

        camera.update();
        world.draw(ctx, camera);   // ← вот это рисует землю

        updatePlayer();
        drawPlayer();

        ctx.restore();

        drawUI();
        requestAnimationFrame(gameLoop);
    } else if (gameOver === true) {
        drawGameOver("GAME OVER");
    } else if (gameOver === "complete") {
        drawGameOver("STAGE COMPLETE");
    }
}

gameLoop();

function drawGameOver(text) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}