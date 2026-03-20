window.camera = {

    x: 0,
    y: 0,
    initialized: false,

    update: function () {

        // ===== ГОРИЗОНТАЛЬ =====
        this.x = player.x - canvas.width * 0.35;

        if (this.x < 0) this.x = 0;
        if (this.x > world.width - canvas.width) {
            this.x = world.width - canvas.width;
        }

        const desiredGround = canvas.height * 0.75;
        const groundY = world.getGroundBase();
        const minCameraY = groundY - desiredGround;

        // ===== ПЕРВЫЙ КАДР =====
        if (!this.initialized) {
            this.y = minCameraY;
            this.initialized = true;
            return;
        }

        // ===== ВЕРТИКАЛЬ =====
        const targetY = player.y - canvas.height / 2;
        this.y += (targetY - this.y) * 0.05;

        // ===== ОГРАНИЧЕНИЕ СНИЗУ =====
        if (this.y > minCameraY) {
            this.y = minCameraY;
        }
    }

};