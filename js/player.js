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
    hitboxOffsetX: CONFIG.PLAYER_HITBOX_OFFSET_X,
    coyoteTimer: 0,
    wasOnGround: false,   // флаг, был ли игрок на земле в предыдущем кадре

    // Прыжок игрока с учётом Coyote Time
    jump() {
        const canJump = (this.onGround || this.coyoteTimer > 0) && window.game.state.gameOver === false;
        if (canJump) {
            this.vy = this.jumpPower;
            this.onGround = false;
            this.coyoteTimer = 0;      // сбрасываем таймер после прыжка
            this.wasOnGround = false;
        }
    },

    // Рисуем игрока с учётом направления и анимации
    draw(ctx, camera) {
        if (!this.sprite || !this.sprite.complete) return;
        ctx.save();

        // 1. Используем отдельную константу для ширины отрисовки
        const drawW = CONFIG.PLAYER_DRAW_WIDTH; // Например, 48
        const drawH = CONFIG.PLAYER_HEIGHT;     // 64
        
        // 2. Центрируем спрайт относительно узкого хитбокса
        // Сдвигаем влево на половину разницы ширин
        const visualOffsetX = (drawW - CONFIG.PLAYER_WIDTH) / 2;

        const drawX = this.x - camera.x - visualOffsetX;
        const drawY = this.y - camera.y;

        const srcX = this.frameX * CONFIG.PLAYER_FRAME_WIDTH + CONFIG.PLAYER_SRC_VISIBLE_X;
        const srcY = CONFIG.PLAYER_SRC_VISIBLE_Y;
        const srcW = CONFIG.PLAYER_SRC_VISIBLE_W;
        const srcH = CONFIG.PLAYER_SRC_VISIBLE_H;

        if (this.moveLeft) {
            // При повороте тоже учитываем drawW
            ctx.translate(drawX + drawW, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.sprite,
                srcX, srcY, srcW, srcH,
                0, 0,
                drawW, drawH
            );
        } else {
            ctx.drawImage(
                this.sprite,
                srcX, srcY, srcW, srcH,
                drawX, drawY,
                drawW, drawH
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
        this.coyoteTimer = 0;
        this.wasOnGround = false;
        console.log("Player initialized at", { x: this.x, y: this.y });
    },

    // Обновление состояния игрока: движение, гравитация, столкновения, анимация
    update(dt) {
        const level = window.game.world ? window.game.world.currentLevel : null;
        if (!level) {
            console.warn("updatePlayer called but no current level");
            return;
        }

        const player = this;
        player.prevY = player.y;
        const frame = Math.max(CONFIG.MIN_FRAME, Math.min(dt * 60, CONFIG.MAX_FRAME));

        const atFinish = player.x + player.width >= level.width - CONFIG.FINISH_THRESHOLD;
        if (atFinish && window.game.state.gameOver === false) {
            window.game.state.gameOver = "complete";
            player.autoMove = true;
            console.log("Level finished! gameOver set to 'complete'");
        }

        // Горизонтальное движение
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

        // Гравитация
        player.vy += player.gravity * frame;
        player.y += player.vy * frame;

        // Коллизии
        const { onGround } = handleCollisions(player, level);
        player.onGround = onGround;

        // Coyote Time: если игрок был на земле, сбрасываем таймер
        if (player.onGround) {
            player.coyoteTimer = CONFIG.PLAYER_COYOTE_TIME;
            player.wasOnGround = true;
        } else {
            if (player.wasOnGround && player.coyoteTimer > 0) {
                player.coyoteTimer -= dt;
            } else {
                player.wasOnGround = false;
            }
        }

        // Ограничения по горизонтали
        if (player.x < 0) player.x = 0;
        if (!player.autoMove && player.x + player.width > level.width && window.game.state.gameOver !== "complete") {
            player.x = level.width - player.width;
        }

        // Падение за пределы уровня
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

        // Анимация
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