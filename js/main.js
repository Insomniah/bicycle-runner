// main.js – игровой цикл, инициализация, рестарт, debug

if (typeof CONFIG === 'undefined') {
    console.error("CONFIG not loaded! Check script order.");
}

// ===============================
// Глобальный объект game (инкапсуляция состояния)
// ===============================
window.game = window.game || {};
window.game.state = {
    gameOver: false,
    nextLevelQueued: false,
    restarting: false
};
// gameOverUI будет присвоен после загрузки game.js (он уже глобален)
window.game.gameOverUI = window.gameOverUI; // если gameOverUI уже существует

// ===============================
// Предзагрузка изображений
// ===============================
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

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
world.sky = sky;
world.mountains = mountains;

loadAllImages().then(() => {
    world.setLevel(level1);
    rocks.generate();

    addToLayer("background", skyBackground);
    addToLayer("background", sky);
    addToLayer("background", mountains);
    addToLayer("midground", rocks);

    resizeCanvas();
    rebuildWorld();

    requestAnimationFrame(gameLoop);
}).catch(err => {
    console.error("Critical error during image loading", err);
});

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();

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

    const state = window.game.state;
    if (state.gameOver) {
        if (window.game.gameOverUI && window.game.gameOverUI.show) {
            window.game.gameOverUI.show(state.gameOver === "complete");
        }

        if (state.gameOver === "complete" && !state.nextLevelQueued && !state.restarting) {
            state.nextLevelQueued = true;

            setTimeout(() => {
                console.log(state.gameOver);
                console.log("switching level...");
                world.setLevel(level2);
                rocks.generate();
                rebuildWorld();
                state.gameOver = false;
                state.nextLevelQueued = false;
                if (window.game.gameOverUI && window.game.gameOverUI.hide) {
                    window.game.gameOverUI.hide();
                }
            }, CONFIG.LEVEL_SWITCH_DELAY);
        }
    }


    requestAnimationFrame(gameLoop);
}

// ===============================
// Рестарт уровня
// ===============================
function restartLevel() {
    const state = window.game.state;
    if (state.restarting) return;
    state.restarting = true;
    try {
        if (!world.currentLevel) return;
        world.currentLevel.generate();
        rocks.generate();
        rebuildWorld();
        initPlayerPosition();

        window.game.player.autoMove = false;
        window.game.player.moveLeft = false;
        window.game.player.moveRight = false;

        state.gameOver = false;
        if (window.game.gameOverUI && window.game.gameOverUI.hide) {
            window.game.gameOverUI.hide();
        }
    } finally {
        state.restarting = false;
    }
}

// ===============================
// Отладочная информация
// ===============================
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
        `GAME: ${window.game.state.gameOver || "running"}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });
}