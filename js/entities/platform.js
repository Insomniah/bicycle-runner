class Platform {

    constructor(x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }

    draw(ctx, camera) {

        const x = this.x - camera.x;
        const y = this.y - camera.y;

        ctx.fillStyle = "#6b4f2a";
        ctx.fillRect(x, y, this.width, this.height);

    }

    checkCollision(player) {

        const playerBottom = player.y + player.height;
        const playerRight = player.x + player.width;
        const playerLeft = player.x;

        const platformTop = this.y;
        const platformLeft = this.x;
        const platformRight = this.x + this.width;

        if (
            player.vy >= 0 &&
            playerBottom >= platformTop &&
            playerBottom <= platformTop + 20 &&
            playerRight > platformLeft &&
            playerLeft < platformRight
        ) {

            player.y = platformTop - player.height;
            player.vy = 0;
            player.onGround = true;

        }

    }

}

window.Platform = Platform;