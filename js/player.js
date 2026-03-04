const player = {
    x: 100,
    y: 0,
    width: 40,
    height: 60,

    velocityX: 0,
    velocityY: 0,

    maxSpeed: 6,
    acceleration: 0.5,
    friction: 0.3,
    gravity: 0.8,
    jumpForce: 15,

    onGround: false,
    crouching: false,

    update(deltaTime) {

        // Управление
        if (input.left) {
            this.velocityX -= this.acceleration;
        }

        if (input.right) {
            this.velocityX += this.acceleration;
        }

        if (!input.left && !input.right) {
            // Трение
            if (this.velocityX > 0) this.velocityX -= this.friction;
            if (this.velocityX < 0) this.velocityX += this.friction;
        }

        // Ограничение скорости
        if (this.velocityX > this.maxSpeed) this.velocityX = this.maxSpeed;
        if (this.velocityX < -this.maxSpeed) this.velocityX = -this.maxSpeed;

        // Прыжок
        if (input.jump && this.onGround) {
            this.velocityY = -this.jumpForce;
            this.onGround = false;
        }

        // Приседание
        this.crouching = input.down;

        // Гравитация
        this.velocityY += this.gravity;

        this.x += this.velocityX;
        this.y += this.velocityY;

        // Столкновение с землей
        const groundLevel = world.groundHeight(this.x);

        if (this.y + this.height >= groundLevel) {
            this.y = groundLevel - this.height;
            this.velocityY = 0;
            this.onGround = true;
        }

        // Ограничение мира
        if (this.x < 0) this.x = 0;
        if (this.x > world.width - this.width)
            this.x = world.width - this.width;
    },

    draw(ctx, camera) {
        ctx.fillStyle = "pink";

        if (this.crouching) {
            ctx.fillRect(
                this.x - camera.x,
                this.y + 20,
                this.width,
                this.height - 20
            );
        } else {
            ctx.fillRect(
                this.x - camera.x,
                this.y,
                this.width,
                this.height
            );
        }
    }
};