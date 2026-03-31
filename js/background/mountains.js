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

    update() {},

    draw(ctx, camera) {
        if (!this.loaded || !this.img) return;
        const level = window.game.world.currentLevel;
        if (!level) return;

        const imgW = this.img.width;
        const imgH = this.img.height;
        const groundY = level.getGroundBase();
        const buryFactor = 0.4;
        const y = groundY - imgH * (1 - buryFactor) - camera.y;

        let startX = Math.floor(camera.x / imgW) * imgW;
        for (let x = startX; x < camera.x + canvas.width + imgW; x += imgW) {
            ctx.drawImage(this.img, x - camera.x, y, imgW, imgH);
        }
    }
};