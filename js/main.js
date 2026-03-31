// main.js – игровой цикл, инициализация, рестарт, debug

if (typeof CONFIG === 'undefined') {
    console.error("CONFIG not loaded! Check script order.");
}

window.game = window.game || {};
window.game.state = {
    gameOver: false,
    nextLevelQueued: false,
    restarting: false,
    debugMode: false,
};
window.game.gameOverUI = window.gameOverUI; // присвоим позже

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
// Методы game
// ===============================
window.game.restart = function() {
    const state = window.game.state;
    if (state.restarting) return;
    state.restarting = true;
    try {
        if (!window.game.world.currentLevel) return;
        window.game.world.currentLevel.generate();
        rocks.generate();
        rebuildWorld();
        window.game.player.initPosition();

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
};

window.game.drawDebug = function() {
    if (!ctx) return;
    const debugMode = window.game.state.debugMode;
    if (!debugMode) return; // ничего не рисуем, если отладка выключена

    ctx.fillStyle = CONFIG.DEBUG_COLOR;
    ctx.font = CONFIG.DEBUG_FONT;
    ctx.textAlign = "left";

    const player = window.game.player;
    const camera = window.game.camera;
    const level = window.game.world.currentLevel;
    if (!player || !camera || !level) return;

    const x = player.x - camera.x;
    const y = player.y - camera.y;
    const rightX = x + player.width;
    const bottomY = y + player.height;

    // Отрисовка полупрозрачного хитбокса
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "lime";
    ctx.fillRect(x, y, player.width, player.height);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, player.width, player.height);
    ctx.restore();

    let lines = [
        `PLAYER: x=${player.x.toFixed(1)}, y=${player.y.toFixed(1)}, vy=${player.vy.toFixed(2)}, onGround=${player.onGround}`,
        `LEVEL: ${level.number} Size: ${level.width} X ${level.height}`,
        `GAME: ${window.game.state.gameOver || "running"}`,
        `HITBOX: left=${x.toFixed(1)}, top=${y.toFixed(1)}, right=${rightX.toFixed(1)}, bottom=${bottomY.toFixed(1)}, width=${player.width}, height=${player.height}`
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, 10, 20 + i * 18);
    });

    lines.push(`COYOTE: ${player.coyoteTimer.toFixed(3)}`);
};

// ===============================
// Инициализация мира и уровней
// ===============================
window.game.world.sky = sky;
window.game.world.mountains = mountains;

loadAllImages().then(() => {
    window.game.world.setLevel(level1);

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
    // Вычисляем dt с ограничением для стабильности
    if (!gameLoop.lastTime) gameLoop.lastTime = time;
    let dt = (time - gameLoop.lastTime) / 1000;
    const maxDt = CONFIG.MAX_DT;
    if (dt > maxDt) dt = maxDt;
    gameLoop.lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновляем все сущности и камеру
    if (window.game.camera && window.game.camera.update) window.game.camera.update();
    if (window.game.player && window.game.player.update) window.game.player.update(dt);
    if (window.game.world && window.game.world.update) window.game.world.update();

    // Рисуем все слои и игрока
    drawLayers(ctx, window.game.camera);
    window.game.player.draw(ctx, window.game.camera);
    if (window.drawUI) drawUI();
    window.game.drawDebug();

    const state = window.game.state;    // Проверяем состояние игры после обновлений
    if (state.gameOver) {               // Если игра закончена, показываем UI и планируем переход на следующий уровень
        if (window.game.gameOverUI && window.game.gameOverUI.show) {
            window.game.gameOverUI.show(state.gameOver === "complete");
        }

        if (state.gameOver === "complete" && !state.nextLevelQueued && !state.restarting) {
            state.nextLevelQueued = true;

            setTimeout(() => {
                console.log("switching level...");
                window.game.world.setLevel(level2);
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