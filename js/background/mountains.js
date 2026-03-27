// background/mountains.js

const mountains = {

    img: null,
    loaded: false,

    generate() {
        this.img = new Image();
        this.img.src = "assets/mountains/mountains-bg.png";

        this.loaded = false;

        this.img.onload = () => {
            this.loaded = true;
        };
    },

    update() {
        // ничего не нужно
    },

    draw(ctx, camera) {
        if (!this.loaded || !this.img) return;

        const level = world.currentLevel;
        if (!level) return;

        const imgW = this.img.width;
        const imgH = this.img.height;

        // привязка к "земле"
        const groundY = level.getGroundBase();
        const buryFactor = 0.4; // 40% утапливаем вниз
        const y = groundY - imgH * (1 - buryFactor) - camera.y; // учитываем камеру по вертикали

        // начинаем рисовать чуть левее камеры
        let startX = Math.floor(camera.x / imgW) * imgW;

        // тайлим до правого края экрана
        for (let x = startX; x < camera.x + canvas.width + imgW; x += imgW) {
            ctx.drawImage(
                this.img,
                x - camera.x,
                y,
                imgW,
                imgH
            );
        }
    }

};

window.mountains = mountains;