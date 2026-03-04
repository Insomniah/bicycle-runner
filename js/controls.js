let input = {
    left: false,
    right: false,
    down: false,
    jump: false
};

canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);
canvas.addEventListener("touchend", resetInput);

function handleTouch(e) {
    resetInput();

    for (let touch of e.touches) {

        if (touch.clientX < canvas.width / 2) {
            // Левая половина — движение

            const centerX = canvas.width * 0.25;
            const centerY = canvas.height * 0.75;

            if (touch.clientX < centerX) input.left = true;
            if (touch.clientX > centerX) input.right = true;
            if (touch.clientY > centerY) input.down = true;

        } else {
            // Правая половина — прыжок
            input.jump = true;
        }
    }
}

function resetInput() {
    input.left = false;
    input.right = false;
    input.down = false;
    input.jump = false;
}