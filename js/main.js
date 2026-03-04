function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, 0);

    updatePlayer();
    drawPlayer();

    ctx.restore();

    drawUI();

    requestAnimationFrame(gameLoop);
}