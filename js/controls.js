let input = {
    left: false,
    right: false,
    down: false,
    jump: false,
    isMobile: false
};

// Определяем мобильное устройство
if ('ontouchstart' in window) {
    input.isMobile = true;
}

// =======================
// Перевод координат в игровые
// =======================

function getGameCoords(clientX, clientY) {

    const rect = canvas.getBoundingClientRect();

    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;

    return { x, y };
}

// =======================
// МОБИЛЬНОЕ УПРАВЛЕНИЕ
// =======================

if (input.isMobile) {

    canvas.addEventListener("touchstart", handleTouch);
    canvas.addEventListener("touchmove", handleTouch);
    canvas.addEventListener("touchend", resetInput);

    function handleTouch(e) {

        resetInput();

        for (let touch of e.touches) {

            const pos = getGameCoords(touch.clientX, touch.clientY);

            // Левая половина — движение
            if (pos.x < canvas.width / 2) {

                const stickCenterX = canvas.width * 0.2;
                const stickCenterY = canvas.height * 0.75;

                if (pos.x < stickCenterX - 30) input.left = true;
                if (pos.x > stickCenterX + 30) input.right = true;
                if (pos.y > stickCenterY + 30) input.down = true;

            } else {
                // Правая половина — прыжок
                input.jump = true;
            }
        }
    }
}

// =======================
// ПК УПРАВЛЕНИЕ
// =======================

window.addEventListener("keydown", (e) => {

    if (e.key === "ArrowLeft" || e.key === "a") input.left = true;
    if (e.key === "ArrowRight" || e.key === "d") input.right = true;
    if (e.key === "ArrowDown" || e.key === "s") input.down = true;
    if (e.key === " " ) input.jump = true;

});

window.addEventListener("keyup", (e) => {

    if (e.key === "ArrowLeft" || e.key === "a") input.left = false;
    if (e.key === "ArrowRight" || e.key === "d") input.right = false;
    if (e.key === "ArrowDown" || e.key === "s") input.down = false;
    if (e.key === " " ) input.jump = false;

});

// =======================
// Сброс
// =======================

function resetInput() {
    input.left = false;
    input.right = false;
    input.down = false;
    input.jump = false;
}