window.camera = {

    x: 0,
    y: 0,

    update: function () {

        // ===== ГОРИЗОНТАЛЬ =====
        // игрок немного левее центра
        this.x = player.x - canvas.width * 0.35;

        if (this.x < 0) this.x = 0;

        if (this.x > world.width - canvas.width) {
            this.x = world.width - canvas.width;
        }


        // ===== ВЕРТИКАЛЬ =====
        // мягкое следование за игроком
        const targetY = player.y - canvas.height / 2;

        this.y += (targetY - this.y) * 0.05;


        // ===== ОГРАНИЧЕНИЕ СНИЗУ =====
        // где земля должна находиться на экране
        const desiredGroundScreenY = canvas.height * 0.75;

        // где она сейчас
        const groundScreenY = world.getGroundBase() - this.y;

        // если земля слишком высоко — опускаем камеру
        if (groundScreenY < desiredGroundScreenY) {
            this.y = world.getGroundBase() - desiredGroundScreenY;
        }

    }

};