// ===== Глобальные переменные игрока =====
window.gameOver = false;

window.player = {
    x: 200,
    y: 0, // задаём после генерации уровня
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
    jump: function() {
        if (this.onGround && !gameOver) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    }
};

// ===== Инициализация позиции игрока после генерации уровня =====
window.initPlayerPosition = function() {
    const ground = level1.getGroundBase();
    player.y = ground - player.height;
};

// ===== Обновление игрока =====
window.updatePlayer = function(dt) {
    player.prevY = player.y;
    const frame = Math.min(dt * 60, 2);

    // ===== Финиш уровня =====
    const atFinish = player.x + player.width >= level1.width - 5;
    if (atFinish && !gameOver) {
        gameOver = "complete";
        player.autoMove = true;
    }

    // ===== Движение =====
    if (!gameOver) {
        if (player.moveLeft) player.x -= player.speed * frame;
        if (player.moveRight) player.x += player.speed * frame;

        if (player.x < 0) player.x = 0;
        if (!player.autoMove && player.x + player.width > level1.width) {
            player.x = level1.width - player.width;
        }
    } else if (gameOver === "complete" && player.autoMove) {
        const maxX = level1.width + 200;
        if (player.x < maxX) player.x += player.speed * frame;
        else player.autoMove = false;
        player.moveLeft = false;
        player.moveRight = false;
    }

    // ===== Гравитация =====
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;
    player.onGround = false;

    // ===== Коллизии с платформами и землёй =====
    const allPlatforms = [...(level1.platforms || []), ...(level1.groundPlatforms || [])];
    for (const p of allPlatforms) {
        const playerBottom = player.y + player.height;
        const prevBottom = player.prevY + player.height;

        const platformTop = p.y;
        const platformLeft = p.x;
        const platformRight = p.x + p.width;

        if (
            player.vy >= 0 &&
            prevBottom <= platformTop &&
            playerBottom >= platformTop &&
            player.x + player.width > platformLeft &&
            player.x < platformRight
        ) {
            player.y = platformTop - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    }

    // ===== Нижний предел мира =====
    const bottomLimit = level1.height + 200;
    if (player.y > bottomLimit) {
        player.y = bottomLimit;
        player.vy = 0;
        gameOver = "fail";
        player.moveLeft = false;
        player.moveRight = false;
    }
};

// ===== Отрисовка игрока =====
window.drawPlayer = function(ctx, camera) {
    if (!ctx || !camera) return; // защита на случай раннего вызова
    ctx.fillStyle = "lime";
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
};