// world.js – управление уровнем и фоном

window.world = {
    sky: null,
    mountains: null,
    currentLevel: null,

    setLevel(level) {
        if (!level) return;
        this.currentLevel = level;

        if (level.generate) level.generate();

        if (window.initPlayerPosition) window.initPlayerPosition();

        if (window.game.player) {
            window.game.player.autoMove = false;
            window.game.player.moveLeft = false;
            window.game.player.moveRight = false;
        }

        if (window.camera) window.camera.initialized = false;

        if (this.sky && this.sky.generate) this.sky.generate();
        if (this.mountains && this.mountains.generate) this.mountains.generate();

        window.game.state.gameOver = false;  // ← изменено
        console.log(`Switched to level: ${level === window.level1 ? "level1" : "level2"}`);
    },

    getGroundBase() {
        if (this.currentLevel && typeof this.currentLevel.getGroundBase === 'function') {
            const val = this.currentLevel.getGroundBase();
            if (typeof val === 'number' && !isNaN(val)) {
                return val;
            }
        }
        console.warn("getGroundBase fallback to 0");
        return 0;
    },

    update() {
        if (this.sky && this.sky.update) this.sky.update();
        if (this.mountains && this.mountains.update) this.mountains.update();
    },

    draw(ctx, camera) {
        if (this.sky && this.sky.draw) this.sky.draw(ctx, camera);
        if (this.mountains && this.mountains.draw) this.mountains.draw(ctx, camera);
    }
};