window.groundLevel = (x) => world.getGroundBase();
window.gameOver = false;

window.player = {
    x: 200,
    y: world.getGroundBase() - 50,
    width: 50,
    height: 50,
    speed: 6,
    vy: 0,            // вертикальная скорость
    gravity: 0.8,
    jumpPower: -15,
    onGround: false,
    moveLeft: false,
    moveRight: false,
    jump: function() {
        if (this.onGround) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    }
};

function updatePlayer() {

    // ===== ДВИЖЕНИЕ ПО ГОРИЗОНТАЛИ =====
    if (player.moveLeft) player.x -= player.speed;
    if (player.moveRight) player.x += player.speed;

    // ===== ОГРАНИЧЕНИЕ УРОВНЯ ПО X =====
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > world.width) {
        player.x = world.width - player.width;
    }

    // ===== ГРАВИТАЦИЯ =====
    player.vy += player.gravity;
    player.y += player.vy;

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
        gameOver = true;
    }

    // ===== STAGE COMPLETE =====
    if (player.x + player.width >= world.width - 5) {
        gameOver = "complete";
    }
}

function drawPlayer() {
    ctx.fillStyle = "lime";
    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
}