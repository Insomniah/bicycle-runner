const skyBackground = {

    draw(ctx, camera) {
    const level = window.game.world.currentLevel;
    const color = level && level.skyColor ? level.skyColor : CONFIG.DEFAULT_SKY_COLOR;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

};