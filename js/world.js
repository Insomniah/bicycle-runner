// world.js — минимальный контейнер для сцены/фона + текущий уровень
const world = {
    // ===== Фоновые объекты =====
    sky: null,
    mountains: null,
    clouds: [],

    // ===== Текущий уровень =====
    currentLevel: null,

    // ===== Методы для работы с объектами мира =====
    addCloud(cloud) {
        this.clouds.push(cloud);
    },

    setLevel(level) {
        this.currentLevel = level;

        // Генерация платформ и земли уровня
        if (level && level.generate) {
            level.generate();
        }

        // Инициализация позиции игрока
        if (window.initPlayerPosition) {
            window.initPlayerPosition();
        }

        // Сброс камеры
        if (window.camera) {
            window.camera.initialized = false;
        }

        // Генерация фоновых объектов
        if (this.sky && this.sky.generate) this.sky.generate();
        if (this.mountains && this.mountains.generate) this.mountains.generate();

        // Сброс состояния игры
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
        for (const cloud of this.clouds) {
            if (cloud.update) cloud.update();
        }
    },

    draw(ctx, camera) {
        if (this.sky && this.sky.draw) this.sky.draw(ctx, camera);
        if (this.mountains && this.mountains.draw) this.mountains.draw(ctx, camera);
        for (const cloud of this.clouds) {
            if (cloud.draw) cloud.draw(ctx, camera);
        }
    }
};

window.world = world;