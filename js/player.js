// ===============================
// Глобальные флаги игры
// ===============================
window.gameOver = false;        // false | "complete" | "fail"
window.player = {
    x: 200,
    y: 0,               // будет установлен после генерации уровня
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
    frameCount: 17, // количество кадров в спрайте
    frameTimer: 0,
    frameInterval: 0.08, // скорость анимации

    jump() {
        if (this.onGround && gameOver === false) {
            this.vy = this.jumpPower;
            this.onGround = false;
        }
    }
};

player.sprite = new Image();
player.sprite.src = "assets/player/player.png";

// ===============================
// Инициализация позиции игрока
// ===============================
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

// ===============================
// Обновление игрока
// ===============================
window.updatePlayer = function(dt) {
    const level = world.currentLevel;
    if (!level) {
        console.warn("updatePlayer called but no current level");
        return;
    }

    player.prevY = player.y;

    const frame = Math.max(0.5, Math.min(dt * 60, 2));

    // ===== ФИНИШ УРОВНЯ =====
    const atFinish = player.x + player.width >= level.width - 5;
    if (atFinish && gameOver === false) {
        gameOver = "complete";
        player.autoMove = true;
        console.log("Level finished! gameOver set to 'complete'");
    }

    // ===== ДВИЖЕНИЕ =====
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

    // ===== ГРАВИТАЦИЯ =====
    player.vy += player.gravity * frame;
    player.y += player.vy * frame;

    // ===== КОЛЛИЗИИ С ПЛАТФОРМАМИ =====
    const allPlatforms = [...(level.platforms || []), ...(level.groundPlatforms || [])];
    player.onGround = false;

    // 1. Вертикальное разрешение: движение вниз (приземление)
    if (player.vy >= 0) {
        for (const p of allPlatforms) {
            const playerBottom = player.y + player.height;
            const prevBottom = player.prevY + player.height;
            if (
                prevBottom <= p.y &&
                playerBottom >= p.y &&
                player.x + player.width > p.x &&
                player.x < p.x + p.width
            ) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
                break;
            }
        }
    } else {
        // 2. Вертикальное разрешение: движение вверх (столкновение головой)
        if (player.vy < 0) {
            for (const p of allPlatforms) {
                // Если платформа проходима снизу — пропускаем
                if (p.passableFromBelow) continue;

                const playerTop = player.y;
                const prevTop = player.prevY;
                if (
                    prevTop >= p.y + p.height &&
                    playerTop <= p.y + p.height &&
                    player.x + player.width > p.x &&
                    player.x < p.x + p.width
                ) {
                    player.y = p.y + p.height;
                    player.vy = 0;
                    break;
                }
            }
        }
    }

    // 3. Горизонтальное разрешение (только после вертикальной коррекции)
    for (const p of allPlatforms) {
        if (player.y + player.height > p.y && player.y < p.y + p.height) {
            if (player.x + player.width > p.x && player.x < p.x) {
                player.x = p.x - player.width;
            } else if (player.x < p.x + p.width && player.x + player.width > p.x + p.width) {
                player.x = p.x + p.width;
            }
        }
    }

    // ===== ОГРАНИЧЕНИЯ ПО ГОРИЗОНТАЛИ =====
    if (player.x < 0) player.x = 0;
    if (!player.autoMove && player.x + player.width > level.width) {
        player.x = level.width - player.width;
    }

    // ===== ПАДЕНИЕ ЗА ПРЕДЕЛЫ =====
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

    // ===== АНИМАЦИЯ =====
    player.frameTimer += dt;
    if (player.frameTimer > player.frameInterval) {
        player.frameTimer = 0;
        player.frameX++;
        if (player.frameX >= player.frameCount) {
            player.frameX = 0;
        }
    }
};

