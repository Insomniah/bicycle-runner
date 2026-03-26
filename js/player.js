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
    const frame = Math.min(dt * 60, 2);

    // ===== ФИНИШ УРОВНЯ =====
    const atFinish = player.x + player.width >= world.width - 5;
    if (atFinish && !gameOver) {
        gameOver = "complete";
        player.autoMove = true;
    }

    // ===== ДВИЖЕНИЕ =====
    if (!gameOver) {
        if (player.moveLeft) player.x -= player.speed * frame;
        if (player.moveRight) player.x += player.speed * frame;

        if (player.x < 0) player.x = 0;
        if (!player.autoMove && player.x + player.width > world.width) {
            player.x = world.width - player.width;
        }
    } else if (gameOver === "complete" && player.autoMove) {
        const maxX = world.width + 200;
        if (player.x < maxX) player.x += player.speed * frame;
        else player.autoMove = false;
        player.moveLeft = false;
        player.moveRight = false;
    }

    // ===== ГРАВИТАЦИЯ =====
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;

    player.onGround = false;

    // ===== КОЛЛИЗИИ С ПЛАТФОРМАМИ УРОВНЯ =====
    const allPlatforms = [...(window.level1?.platforms || []), ...world.groundPlatforms];
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

    // ===== НИЖНИЙ ПРЕДЕЛ МИРА =====
    const bottomLimit = world.height + 200; // дно мира
    if (player.y > bottomLimit) {
        player.y = bottomLimit;
        player.vy = 0;
        gameOver = "fail";
        player.moveLeft = false;
        player.moveRight = false;
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