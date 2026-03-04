const camera = {
    x: 0,

    update() {
        this.x = player.x - canvas.width / 2;

        if (this.x < 0) this.x = 0;
        if (this.x > world.width - canvas.width)
            this.x = world.width - canvas.width;
    }
};