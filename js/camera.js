window.camera = {
    x: 0,
    y: 0,
    initialized: false,

    update: function () {
        const level = window.world.currentLevel;
        const player = window.game.player;
        if (!player || !level) return;

        this.x = player.x - canvas.width * 0.35;
        if (this.x < 0) this.x = 0;
        if (this.x > level.width - canvas.width) {
            this.x = level.width - canvas.width;
        }

        const desiredGround = canvas.height * 0.75;
        const groundY = level.getGroundBase();
        const minCameraY = groundY - desiredGround;

        if (!this.initialized) {
            this.y = minCameraY;
            this.initialized = true;
            return;
        }

        const targetY = player.y - canvas.height / 2;
        this.y += (targetY - this.y) * 0.05;
        if (this.y > minCameraY) {
            this.y = minCameraY;
        }
    }
};