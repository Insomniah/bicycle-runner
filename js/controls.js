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
        e.preventDefault(); // убираем скролл страницы

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];

        if (!touch) return;

        // переводим координаты в игровую систему
        const x = (touch.clientX - rect.left) / scale;
        const y = (touch.clientY - rect.top) / scale;

        const screenWidth = canvas.width;

        // левая половина — движение
        if (x < screenWidth / 2) {
            if (x < screenWidth / 4) {
                player.moveLeft = true;
                player.moveRight = false;
            } else {
                player.moveRight = true;
                player.moveLeft = false;
            }
        } 
        // правая половина — прыжок
        else {
            player.jump();
        }
    }
}

canvas.addEventListener("touchstart", handleTouch, { passive: false });
canvas.addEventListener("touchmove", handleTouch, { passive: false });

canvas.addEventListener("touchend", () => {
    player.moveLeft = false;
    player.moveRight = false;
});

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

function drawUI() {

    if (!input.isMobile) return;

    ctx.save();
    ctx.globalAlpha = 0.3;

    // Левая зона движения
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(150, canvas.height - 150, 100, 0, Math.PI * 2);
    ctx.fill();

    // Правая зона прыжка
    ctx.beginPath();
    ctx.arc(canvas.width - 150, canvas.height - 150, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}