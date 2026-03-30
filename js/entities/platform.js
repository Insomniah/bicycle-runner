class Platform {
    constructor(x, y, width, height, passableFromBelow = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.passableFromBelow = passableFromBelow;
    }

    draw(ctx, camera) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        ctx.fillStyle = "#6b4f2a";
        ctx.fillRect(x, y, this.width, this.height);
    }
}

window.Platform = Platform;