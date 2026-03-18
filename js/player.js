window.groundLevel = (x) => world.getGroundBase();
window.gameOver = false;

window.player = {
    x: 200,
    y: world.getGroundBase() - 50,
    width: 50,
    height: 50,
    speed: 6,
    vy: 0,
    gravity: 0.8,
    jumpPower: -15,
    onGround: false,
    moveLeft: false,
    moveRight: false,
    jump: function() {
        if (this.onGround && !gameOver) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    }
};

function updatePlayer(dt) {
    const frame = Math.min(dt * 60, 2);

    // ===== ФИНИШ УРОВНЯ =====
    const atFinish = player.x + player.width >= world.width - 5;
    if (atFinish && !gameOver) {
        gameOver = "complete";
    }

    // ===== ДВИЖЕНИЕ =====
    if (!gameOver) {
        if (player.moveLeft) player.x -= player.speed * frame;
        if (player.moveRight) player.x += player.speed * frame;
        // Ограничение внутри уровня только если нет финиша
        if (player.x < 0) player.x = 0;
    } else if (gameOver === "complete") {
        // Автоматический уход за край
        player.x += player.speed * frame;
        player.moveLeft = false;
        player.moveRight = false;
    }

    // ===== ГРАВИТАЦИЯ =====
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;

    // ===== СБРОС НА ГРУНТ =====
    player.onGround = false;
    const ground = world.groundHeight(player.x);
    if (player.y + player.height >= ground) {
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
    if (player.y > canvas.height + 300) {
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
    console.log(player.x, player.y)
}