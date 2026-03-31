// player.js – данные игрока, движение, анимация, отрисовка

window.game = window.game || {};

// глобальный объект игрока, с данными и методами
window.game.player = {
    x: CONFIG.PLAYER_START_X,
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

    // Прыжок игрока
    jump() {
        if (this.onGround && window.game.state.gameOver === false) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    },

    // Рисуем игрока с учётом направления и анимации
    draw(ctx, camera) {
        if (!this.sprite || !this.sprite.complete) return;
        ctx.save();

        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        const srcX = this.frameX * CONFIG.PLAYER_FRAME_WIDTH + CONFIG.PLAYER_SRC_VISIBLE_X; // Учитываем видимую часть спрайта
        const srcY = CONFIG.PLAYER_SRC_VISIBLE_Y;
        const srcW = CONFIG.PLAYER_SRC_VISIBLE_W;
        const srcH = CONFIG.PLAYER_SRC_VISIBLE_H;
        const dstW = CONFIG.PLAYER_WIDTH;
        const dstH = CONFIG.PLAYER_HEIGHT;

        if (this.moveLeft) {
            // Смещаем контекст, отражаем, рисуем
            ctx.translate(drawX + dstW, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.sprite,
                srcX, srcY, srcW, srcH,
                0, 0,
                dstW, dstH
            );
        } else {
            ctx.drawImage(
                this.sprite,
                srcX, srcY, srcW, srcH,
                drawX, drawY,
                dstW, dstH
            );
        }
        ctx.restore();
    },

    // Инициализация позиции игрока на уровне
    initPosition() {
        const level = window.game.world.currentLevel;
        if (!level) return;
        this.y = level.getGroundBase() - this.height;
        this.x = CONFIG.PLAYER_START_X;
        this.vy = 0;
        this.onGround = false;
        this.autoMove = false;
        console.log("Player initialized at", { x: this.x, y: this.y });
    },

    // Обновление состояния игрока: движение, гравитация, столкновения, анимация
    update(dt) {

        // Проверяем наличие уровня и игрока
        const level = window.game.world ? window.game.world.currentLevel : null;
        if (!level) {
            console.warn("updatePlayer called but no current level");
            return;
        }
        
        const player = this;
        player.prevY = player.y;
        const frame = Math.max(CONFIG.MIN_FRAME, Math.min(dt * 60, CONFIG.MAX_FRAME));// Ограничиваем dt для стабильности

        const atFinish = player.x + player.width >= level.width - CONFIG.FINISH_THRESHOLD; // Проверяем достижение финиша
        if (atFinish && window.game.state.gameOver === false) {
            window.game.state.gameOver = "complete";
            player.autoMove = true;
            console.log("Level finished! gameOver set to 'complete'");
        }

        // Горизонтальное движение игрока, только если игра не закончена
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

        // Применяем гравитацию
        player.vy += player.gravity * frame;
        player.y += player.vy * frame;

        const { onGround } = handleCollisions(player, level); // Проверяем столкновения и обновляем onGround
        player.onGround = onGround;

        // Ограничиваем игрока в пределах уровня
        if (player.x < 0) player.x = 0;
        if (!player.autoMove && player.x + player.width > level.width && window.game.state.gameOver !== "complete") {
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

        // Обновляем анимацию игрока
        player.frameTimer += dt;
        if (player.frameTimer > player.frameInterval) {
            player.frameTimer = 0;
            player.frameX++;
            if (player.frameX >= player.frameCount) {
                player.frameX = 0;
            }
        }
    }
};

window.game.player.sprite = new Image();
window.game.player.sprite.src = "assets/player/player.png";