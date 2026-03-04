const player = {
    x: 200,
    y: 500,
    width: 50,
    height: 50,
    speed: 6,
    velocityY: 0,
    gravity: 0.8,
    jumpPower: -15,
    onGround: false
};

function updatePlayer() {

    if (input.left) player.x -= player.speed;
    if (input.right) player.x += player.speed;

    if (input.jump && player.onGround) {
        player.velocityY = player.jumpPower;
        player.onGround = false;
    }

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
    }
}

function drawPlayer() {
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}