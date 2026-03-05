window.groundLevel = (x) => world.groundHeight(x);
window.gameOver = false;

window.player = {
    x: 200,
    y: 500,
    width: 50,
    height: 50,
    speed: 6,
    velocityY: 0,
    gravity: 0.8,
    jumpPower: -15,
    onGround: false,
    moveLeft: false,
    moveRight: false,
    jump: function() {
        if (this.onGround) {
            this.velocityY = this.jumpPower;
            this.onGround = false;
        }
    }
};

function updatePlayer() {

    // ===== ДВИЖЕНИЕ ПО ГОРИЗОНТАЛИ =====
    if (player.moveLeft) {
        player.x -= player.speed;
    }

    if (player.moveRight) {
        player.x += player.speed;
    }


    // ===== ОГРАНИЧЕНИЕ УРОВНЯ ПО X =====
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > levelWidth) {
        player.x = levelWidth - player.width;
    }


    // ===== ГРАВИТАЦИЯ =====
player.velocityY += player.gravity;
player.y += player.velocityY;


// ===== СТОЛКНОВЕНИЕ С ЗЕМЛЁЙ =====
const ground = groundLevel(player.x);

if (player.y + player.height >= ground) {
    player.y = ground - player.height;
    player.velocityY = 0;
    player.onGround = true;
} else {
    player.onGround = false;
}


// ===== ПАДЕНИЕ В БЕЗДНУ =====
if (player.y > canvas.height + 300) {
    gameOver = true;
}


    // ===== STAGE COMPLETE =====
    if (player.x + player.width >= levelWidth - 5) {
        gameOver = "complete";
    }


    // ===== КАМЕРА =====
    camera.x = player.x - canvas.width / 2 + player.width / 2;

    if (camera.x < 0) {
        camera.x = 0;
    }

    if (camera.x + canvas.width > levelWidth) {
        camera.x = levelWidth - canvas.width;
    }
}

function drawPlayer() {
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}