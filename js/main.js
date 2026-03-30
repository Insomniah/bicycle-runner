// main.js – игровой цикл, инициализация, рестарт, debug

if (typeof CONFIG === 'undefined') {
    console.error("CONFIG not loaded! Check script order.");
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// асинхронная загрузка всех изображений перед стартом игры
async function loadAllImages() {
    const promises = [];

    promises.push(
        loadImage("assets/player/player.png").then(img => {
            window.game.player.sprite = img;
        })
    );
    promises.push(
        loadImage("assets/mountains/mountains-bg.png").then(img => {
            mountains.img = img;
            mountains.loaded = true;
        })
    );
    for (const type of rocks.rockTypes) {
        promises.push(
            loadImage(type.src).then(img => {
                rocks.images.push(img);
            })
        );
    }

    try {
        await Promise.all(promises);
        console.log("All images loaded");
        rocks.loaded = true;
    } catch (err) {
        console.error("Failed to load some images", err);
    }
}

// ===============================
// Инициализация мира и уровней
// ===============================
window.game = window.game || {};
window.gameOver = false; // временно оставляем глобальным, позже перенесём в game.state

world.sky = sky;
world.mountains = mountains;

let restarting = false;

loadAllImages().then(() => {
    world.setLevel(level1);
    rocks.generate();

    addToLayer("background", skyBackground);
    addToLayer("background", sky);
    addToLayer("background", mountains);
    addToLayer("midground", rocks);

    recalcScene();

    requestAnimationFrame(gameLoop);
}).catch(err => {
    console.error("Critical error during image loading", err);
});

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();
let nextLevelQueued = false;

function gameLoop(time) {
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    let dt = (time - gameLoop.lastTime) / 1000;
    const maxDt = CONFIG.MAX_DT;
    if (dt > maxDt) dt = maxDt;
    gameLoop.lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (camera && camera.update) camera.update();
    if (window.updatePlayer) window.updatePlayer(dt);
    if (world && world.update) world.update();

    drawLayers(ctx, camera);
    window.game.player.draw(ctx, camera);
    if (window.drawUI) drawUI();
    drawDebug();

    if (window.gameOver) {
        if (gameOverUI && gameOverUI.show) gameOverUI.show(window.gameOver === "complete");

        if (window.gameOver === "complete" && !nextLevelQueued && !restarting) {
            nextLevelQueued = true;

            setTimeout(() => {
                console.log("Switching to level2...");
                world.setLevel(level2);
                rocks.generate();
                recalcScene();

                window.gameOver = false;
                nextLevelQueued = false;
                gameOverUI.hide();
            }, CONFIG.LEVEL_SWITCH_DELAY);
        }
    }

    requestAnimationFrame(gameLoop);
}

function restartLevel() {
    if (restarting) return;
    restarting = true;

    try {
        if (!world.currentLevel) return;

        world.currentLevel.generate();
        rocks.generate();
        recalcScene();
        initPlayerPosition();

        window.game.player.autoMove = false;
        window.game.player.moveLeft = false;
        window.game.player.moveRight = false;

        window.gameOver = false;
        if (gameOverUI && gameOverUI.hide) gameOverUI.hide();
    } finally {
        restarting = false;
    }
}

function drawDebug() {
    if (!ctx) return;
    ctx.fillStyle = CONFIG.DEBUG_COLOR;
    ctx.font = CONFIG.DEBUG_FONT;
    ctx.textAlign = "left";

    const level = world.currentLevel;
    if (!level) return;

    let lines = [
        `PLAYER: x=${window.game.player.x.toFixed(1)}, y=${window.game.player.y.toFixed(1)}, vy=${window.game.player.vy.toFixed(2)}, onGround=${window.game.player.onGround}`,
        `LEVEL: ${level.number} Size: ${level.width} X ${level.height}`,
        `GAME: ${window.gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
}