// world.js — минимальный контейнер для сцены/фона
const world = {
    // ===== Фоновые объекты =====
    sky: null,
    mountains: null,
    clouds: [],

    // ===== Методы для работы с объектами мира =====
    addCloud(cloud) {
        this.clouds.push(cloud);
    },

    // Можно добавить методы для обновления/отрисовки фона, камеры и эффектов
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