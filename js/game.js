const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Всегда горизонтальный режим
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    player.update(deltaTime);
    camera.update();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    world.draw(ctx, camera);
    player.draw(ctx, camera);
}

requestAnimationFrame(gameLoop);