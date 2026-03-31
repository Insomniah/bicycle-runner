// player.js – данные игрока, движение, анимация, отрисовка

window.game = window.game || {};
window.game.player = {
    x: 200,
    y: 0,
    width: CONFIG.PLAYER_WIDTH,
    height: CONFIG.PLAYER_HEIGHT,
    speed: CONFIG.PLAYER_SPEED,
    vy: 0,
    gravity: CONFIG.PLAYER_GRAVITY,
    jumpPower: CONFIG.PLAYER_JUMP_POWER,
    onGround: false,
    moveLeft: false,
    moveRight: false,
    autoMove: false,
    prevY: 0,
    sprite: null,

    frameX: 0,
    frameY: 0,
    frameWidth: CONFIG.PLAYER_FRAME_WIDTH,
    frameHeight: CONFIG.PLAYER_FRAME_HEIGHT,
    frameCount: CONFIG.PLAYER_FRAME_COUNT,
    frameTimer: 0,
    frameInterval: CONFIG.PLAYER_FRAME_INTERVAL,

    jump() {
        if (this.onGround && window.game.state.gameOver === false) {
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

window.game.player.sprite = new Image();
window.game.player.sprite.src = "assets/player/player.png";

window.initPlayerPosition = function() {
    const level = window.game.world.currentLevel;
    if (!level) return;
    window.game.player.y = level.getGroundBase() - window.game.player.height;
    window.game.player.x = 200;
    window.game.player.vy = 0;
    window.game.player.onGround = false;
    window.game.player.autoMove = false;
    console.log("Player initialized at", { x: window.game.player.x, y: window.game.player.y });
};

window.updatePlayer = function(dt) {
    const level = window.game.world ? window.game.world.currentLevel : null;
    if (!level) {
        console.warn("updatePlayer called but no current level");
        return;
    }

    const player = window.game.player;
    player.prevY = player.y;
    const frame = Math.max(0.5, Math.min(dt * 60, 2));

    const atFinish = player.x + player.width >= level.width - CONFIG.FINISH_THRESHOLD;
    if (atFinish && window.game.state.gameOver === false) {
        window.game.state.gameOver = "complete";
        player.autoMove = true;
        console.log("Level finished! gameOver set to 'complete'");
    }

    if (window.game.state.gameOver === false) {
        if (player.moveLeft) player.x -= player.speed * frame;
        if (player.moveRight) player.x += player.speed * frame;
    }
    else if (window.game.state.gameOver === "complete" && player.autoMove) {
        const maxX = level.width + CONFIG.AUTO_MOVE_EXTRA;
        if (player.x < maxX) player.x += player.speed * frame;
        else player.autoMove = false;
        player.moveLeft = false;
        player.moveRight = false;
    }

    player.vy += player.gravity * frame;
    player.y += player.vy * frame;

    const { onGround } = handleCollisions(player, level);
    player.onGround = onGround;

    if (player.x < 0) player.x = 0;
    if (!player.autoMove && player.x + player.width > level.width) {
        player.x = level.width - player.width;
    }

    const bottomLimit = level.height + CONFIG.FALL_LIMIT_OFFSET;
    if (player.y > bottomLimit) {
        player.y = bottomLimit;
        player.vy = 0;
        if (window.game.state.gameOver === false) {
            window.game.state.gameOver = "fail";
            console.log("Player fell off level, gameOver = fail");
        }
        player.moveLeft = false;
        player.moveRight = false;
    }

    player.frameTimer += dt;
    if (player.frameTimer > player.frameInterval) {
        player.frameTimer = 0;
        player.frameX++;
        if (player.frameX >= player.frameCount) {
            player.frameX = 0;
        }
    }
};