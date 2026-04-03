// wheel.js – класс колеса (собираемый предмет с анимацией)
class Wheel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.WHEEL_DRAW_SIZE;
        this.height = CONFIG.WHEEL_DRAW_SIZE;
        this.collected = false;
        this.currentFrame = 0;
        this.accumulator = 0; // накопитель времени
    }

    update(dt) {
        if (this.collected) return;
        // Ограничиваем dt, чтобы избежать слишком больших скачков
        if (dt > 0.033) dt = 0.033;
        this.accumulator += dt;
        const frameDuration = CONFIG.WHEEL_FRAME_INTERVAL;
        if (this.accumulator >= frameDuration) {
            // Вычитаем целое количество интервалов, чтобы сохранить остаток
            this.accumulator -= frameDuration;
            this.currentFrame = (this.currentFrame + 1) % CONFIG.WHEEL_FRAME_COUNT;
        }
    }

    draw(ctx, camera) {
        if (this.collected) return;
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        const srcX = this.currentFrame * CONFIG.WHEEL_FRAME_W;
        const srcY = CONFIG.WHEEL_SPRITE_SRC_Y;
        const srcW = CONFIG.WHEEL_FRAME_W;
        const srcH = CONFIG.WHEEL_SPRITE_SRC_H;
        if (window.wheelSprite) {
            ctx.drawImage(
                window.wheelSprite,
                srcX, srcY, srcW, srcH,
                screenX, screenY, this.width, this.height
            );
        } else {
            // fallback: рисуем круг
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(screenX + this.width/2, screenY + this.height/2, this.width/2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    collect(player) {
        if (this.collected) return false;
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            this.collected = true;
            return true;
        }
        return false;
    }
}