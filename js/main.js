// генерируем фоновые объекты
sky.generate();
mountains.generate();

// регистрируем слои

addToLayer("background", skyBackground);
addToLayer("background", sky);
addToLayer("background", mountains);
addToLayer("world", world);

// добавляем платформы уровня

for (const p of level1.platforms) {
    addToLayer("world", p);
}


// основной игровой цикл

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {

        updatePlayer();
        camera.update();
        sky.update();

        drawLayers(ctx, camera);

        // игрок
        drawPlayer();

        // интерфейс
        drawUI();

        requestAnimationFrame(gameLoop);

    }

    else if (gameOver === true) {

        drawLayers(ctx, camera);
        drawGameOver("GAME OVER");

    }

    else if (gameOver === "complete") {

        drawLayers(ctx, camera);
        drawGameOver("STAGE COMPLETE");

    }

}

gameLoop();


// экран окончания игры

function drawGameOver(text) {

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

}