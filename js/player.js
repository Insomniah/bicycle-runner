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
    if (player.moveLeft) player.x -= player.speed;
    if (player.moveRight) player.x += player.speed;

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
    }

    // камера следует за игроком
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    if (camera.x < 0) camera.x = 0;
}

function drawPlayer() {
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}