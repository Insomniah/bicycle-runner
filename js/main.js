function drawBackground() {
    // базовое небо
    ctx.fillStyle = "#5c94fc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // облака и земля теперь рисуются миром
    world.drawSky(ctx, camera);
}

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    if (!gameOver) {

        camera.update();

        updatePlayer();

        world.draw(ctx, camera);

        drawPlayer();

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