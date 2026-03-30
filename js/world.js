// world.js — минимальный контейнер для сцены/фона + текущий уровень
const world = {
    // ===== Фоновые объекты =====
    sky: null,
    mountains: null,
    // ===== Текущий уровень =====
    currentLevel: null,

    setLevel(level) {
        this.currentLevel = level;
        if (level && level.generate) level.generate();

        if (window.initPlayerPosition) window.initPlayerPosition();

        // Сброс авто-движения и управления после смены уровня
        if (window.player) {
            window.player.autoMove = false;
            window.player.moveLeft = false;
            window.player.moveRight = false;
        }

        if (window.camera) window.camera.initialized = false;

        if (this.sky && this.sky.generate) this.sky.generate();
        if (this.mountains && this.mountains.generate) this.mountains.generate();

        window.gameOver = false;
        console.log(`Switched to level: ${level === window.level1 ? "level1" : "level2"}`);
    },

    // ===== Универсальный метод для получения "земли" =====
    getGroundBase() {
        if (this.currentLevel && this.currentLevel.getGroundBase) {
            return this.currentLevel.getGroundBase();
        }
        return 0;
    },

    // ===== Обновление фоновых объектов =====
    update() {
        if (this.sky && this.sky.update) this.sky.update();
        if (this.mountains && this.mountains.update) this.mountains.update();
    },

    draw(ctx, camera) {
        if (this.sky && this.sky.draw) this.sky.draw(ctx, camera);
        if (this.mountains && this.mountains.draw) this.mountains.draw(ctx, camera);
    }
};

window.world = world;