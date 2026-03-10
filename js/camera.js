window.camera = {

    x: 0,
    y: 0,

    update: function () {

        // горизонтальное следование, игрок немного левее центра, чтобы видеть уровень впереди
        this.x = player.x - canvas.width * 0.35;

        if (this.x < 0) this.x = 0;

        if (this.x > world.width - canvas.width) {
            this.x = world.width - canvas.width;
        }

        // вертикальное следование (очень слабое)
        const targetY = player.y - canvas.height / 2;

        this.y += (targetY - this.y) * 0.05;

    }

};