// player.js – данные игрока, движение, анимация, отрисовка

window.player = {
    x: 200,
    y: 0,
    width: 48,
    height: 48,
    speed: 6,
    vy: 0,
    gravity: 0.3,
    jumpPower: -9,
    onGround: false,
    moveLeft: false,
    moveRight: false,
    autoMove: false,
    prevY: 0,
    sprite: null,

    frameX: 0,
    frameY: 0,
    frameWidth: 16,
    frameHeight: 16,
    frameCount: 17,
    frameTimer: 0,
    frameInterval: 0.08,

    jump() {
        if (this.onGround && gameOver === false) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    },

    draw(ctx, camera) {
        if (!this.sprite || !this.sprite.complete) return;
        ctx.save();
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        if (this.moveLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.sprite,
                this.frameX * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                -drawX - this.width, drawY,
                this.width, this.height
            );
        } else {
            ctx.drawImage(
                this.sprite,
                this.frameX * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                drawX, drawY,
                this.width, this.height
            );
        }
        ctx.restore();
    }
};

player.sprite = new Image();
player.sprite.src = "assets/player/player.png";

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

window.updatePlayer = function(dt) {
    const level = world.currentLevel;
    if (!level) {
        console.warn("updatePlayer called but no current level");
        return;
    }

    player.prevY = player.y;
    const frame = Math.max(0.5, Math.min(dt * 60, 2));

    // Финиш уровня
    const atFinish = player.x + player.width >= level.width - 5;
    if (atFinish && gameOver === false) {
        gameOver = "complete";
        player.autoMove = true;
        console.log("Level finished! gameOver set to 'complete'");
    }

    // Движение
    if (gameOver === false) {
        if (player.moveLeft) player.x -= player.speed * frame;
        if (player.moveRight) player.x += player.speed * frame;
    }
    else if (gameOver === "complete" && player.autoMove) {
        const maxX = level.width + 200;
        if (player.x < maxX) player.x += player.speed * frame;
        else player.autoMove = false;
        player.moveLeft = false;
        player.moveRight = false;
    }

    // Гравитация
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;

    // Коллизии (вызываем из отдельного модуля)
    const { onGround } = handleCollisions(player, level);
    player.onGround = onGround;

    // Ограничения по горизонтали
    if (player.x < 0) player.x = 0;
    if (!player.autoMove && player.x + player.width > level.width) {
        player.x = level.width - player.width;
    }

    // Падение за пределы уровня
    const bottomLimit = level.height + 200;
    if (player.y > bottomLimit) {
        player.y = bottomLimit;
        player.vy = 0;
        if (gameOver === false) {
            gameOver = "fail";
            console.log("Player fell off level, gameOver = fail");
        }
        player.moveLeft = false;
        player.moveRight = false;
    }

    // Анимация
    player.frameTimer += dt;
    if (player.frameTimer > player.frameInterval) {
        player.frameTimer = 0;
        player.frameX++;
        if (player.frameX >= player.frameCount) {
            player.frameX = 0;
        }
    }
};