// ===============================
// Глобальные флаги игры
// ===============================
window.gameOver = false;        // false | "complete" | "fail"
window.player = {
    x: 200,
    y: 0,               // будет установлен после генерации уровня
    width: 50,
    height: 50,
    speed: 6,
    vy: 0,
    gravity: 0.3,
    jumpPower: -9,
    onGround: false,
    moveLeft: false,
    moveRight: false,
    autoMove: false,
    prevY: 0,

    jump() {
        if (this.onGround && gameOver === false) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    }
};

// ===============================
// Инициализация позиции игрока
// ===============================
window.initPlayerPosition = function() {
    const level = world.currentLevel;
    if (!level) return;

    player.y = level.getGroundBase() - player.height;
    player.x = 200;
    player.vy = 0;
    player.onGround = false;
    player.autoMove = false;

    console.log("Player initialized at", { x: player.x, y: player.y });
};

// ===============================
// Обновление игрока
// ===============================
window.updatePlayer = function(dt) {
    const level = world.currentLevel;
    if (!level) {
        console.warn("updatePlayer called but no current level");
        return;
    }

    player.prevY = player.y;

    const frame = Math.max(0.5, Math.min(dt * 60, 2));

    // ===== ФИНИШ УРОВНЯ =====
    const atFinish = player.x + player.width >= level.width - 5;
    if (atFinish && gameOver === false) {
        gameOver = "complete";
        player.autoMove = true;
        console.log("Level finished! gameOver set to 'complete'");
    }

    // ===== ДВИЖЕНИЕ =====
    if (gameOver === false) {
        if (player.moveLeft) {
            player.x -= player.speed * frame;
        }
        if (player.moveRight) {
            player.x += player.speed * frame;
        }
    }
    else if (gameOver === "complete" && player.autoMove) {
        const maxX = level.width + 200;
        if (player.x < maxX) player.x += player.speed * frame;
        else player.autoMove = false;

        player.moveLeft = false;
        player.moveRight = false;
    }

    // ===== ГРАВИТАЦИЯ =====
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;
    player.onGround = false;

    // ===== КОЛЛИЗИИ С ПЛАТФОРМАМИ =====
    const allPlatforms = [...(level.platforms || []), ...(level.groundPlatforms || [])];
    for (const p of allPlatforms) {
        const playerBottom = player.y + player.height;
        const prevBottom = player.prevY + player.height;
        if (
            player.vy >= 0 &&
            prevBottom <= p.y &&
            playerBottom >= p.y &&
            player.x + player.width > p.x &&
            player.x < p.x + p.width
        ) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    }
    // ===== ОГРАНИЧЕНИЯ ПО ГОРИЗОНТАЛИ =====
    if (player.x < 0) {
        player.x = 0;
        player.moveLeft = false;
    }

    // ===== ПАДЕНИЕ ЗА ПРЕДЕЛЫ =====
    const bottomLimit = level.height + 200;
    if (player.y > bottomLimit) {
        player.y = bottomLimit;
        player.vy = 0;
        if (gameOver === false) gameOver = "fail";
        player.moveLeft = false;
        player.moveRight = false;
        console.log("Player fell off level, gameOver =", gameOver);
    }
};

// ===============================
// Отрисовка игрока
// ===============================
window.drawPlayer = function(ctx, camera) {
    if (!ctx || !camera) return;

    ctx.fillStyle = "lime";
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
};