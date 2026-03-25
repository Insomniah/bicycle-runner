window.groundLevel = (x) => world.getGroundBase();
window.gameOver = false;

window.player = {
    x: 200,
    y: world.getGroundBase() - 50,
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

function updatePlayer(dt) {
    player.prevY = player.y;
    const frame = Math.min(dt * 60, 2); // нормализация скорости для разных FPS

    // ===== ФИНИШ УРОВНЯ =====
    const atFinish = player.x + player.width >= world.width - 5;
    if (atFinish && !gameOver) {
        gameOver = "complete";
        player.autoMove = true; // включаем авто-движение за край
    }

    // ===== ДВИЖЕНИЕ =====
    if (!gameOver) {
        if (player.moveLeft) player.x -= player.speed * frame;
        if (player.moveRight) player.x += player.speed * frame;

        // Ограничение по левому краю
        if (player.x < 0) player.x = 0;

        // Ограничение по правому краю только если нет финиша
        if (!player.autoMove && player.x + player.width > world.width) {
            player.x = world.width - player.width;
        }
    } else if (gameOver === "complete" && player.autoMove) {
        // Авто-движение за предел экрана
        const maxX = world.width + 200; // сколько нужно для визуального ухода
        if (player.x < maxX) player.x += player.speed * frame;
        else player.autoMove = false; // останавливаем после ухода
        player.moveLeft = false;
        player.moveRight = false;
    }

    // ===== ГРАВИТАЦИЯ =====
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;

    // ===== КОЛЛИЗИЯ С ЗЕМЛЕЙ (ПРАВИЛЬНАЯ) =====
    player.onGround = false;

    const leftGround = world.groundHeight(player.x);
    const rightGround = world.groundHeight(player.x + player.width);

    // Берём БОЛЬШЕЕ значение (самую высокую поверхность)
    const ground = Math.min(leftGround, rightGround);

    const playerBottom = player.y + player.height;
    const prevBottom = player.prevY + player.height;

    // Проверяем, что игрок ПАДАЛ СВЕРХУ
    if (
        player.vy >= 0 &&
        prevBottom <= ground &&
        playerBottom >= ground
    ) {
        player.y = ground - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // ===== КОЛЛИЗИИ С ПЛАТФОРМАМИ =====
    if (window.level1 && level1.platforms) {
        for (const p of level1.platforms) {
            p.checkCollision(player);
        }
    }

    // ===== ПАДЕНИЕ В БЕЗДНУ =====
    if (player.y - camera.y > canvas.height + 300) {
        gameOver = "fail";
    }
}

// ===== ОТРИСОВКА ИГРОКА =====
window.drawPlayer = function() {
    ctx.fillStyle = "lime";
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
}