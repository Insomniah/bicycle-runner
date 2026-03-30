const world = {
    sky: null,
    mountains: null,
    currentLevel: null,

    // Установка уровня и генерация его элементов 
    setLevel(level) {
        if (!level) return;
        this.currentLevel = level;

        if (level.generate) level.generate();

        if (window.initPlayerPosition) window.initPlayerPosition();

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

    // Получение базовой высоты земли для текущего уровня
    getGroundBase() {
        if (this.currentLevel && this.currentLevel.getGroundBase) {
            return this.currentLevel.getGroundBase();
        }
        return 0;
    },

    // Обновление мира (движение облаков, анимация и т.д.)
    update() {
        if (this.sky && this.sky.update) this.sky.update();
        if (this.mountains && this.mountains.update) this.mountains.update();
        // если остались какие-то облака в массиве (уже удалено)
    },

    // Отрисовка мира (небо, горы и т.д.)
    draw(ctx, camera) {
        if (this.sky && this.sky.draw) this.sky.draw(ctx, camera);
        if (this.mountains && this.mountains.draw) this.mountains.draw(ctx, camera);
    }
};

window.world = world;