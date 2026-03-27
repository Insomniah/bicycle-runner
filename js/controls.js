window.input = {
    left: false,
    right: false,
    down: false,
    jump: false,
    isMobile: 'ontouchstart' in window
};

function getGameCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
    x: clientX - rect.left,
    y: clientY - rect.top
};
}

// мобильное управление
if (input.isMobile) {
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("touchmove", handleTouch, { passive: false });
    canvas.addEventListener("touchend", (e) => {
        if (e.touches.length === 0) {
            player.moveLeft = false;
            player.moveRight = false;
        } else {
            handleTouch(e); // пересчитать состояние по оставшимся пальцам
        }
    });
}

function handleTouch(e) {
    e.preventDefault();

    let moveLeft = false;
    let moveRight = false;
    let jumpPressed = false;

    for (const touch of e.touches) {
        const pos = getGameCoords(touch.clientX, touch.clientY);

        // ===== ЗОНА ДВИЖЕНИЯ =====
        const moveZoneX = 150;
        const moveZoneY = canvas.height - 150;

        const dxMove = pos.x - moveZoneX;
        const dyMove = pos.y - moveZoneY;
        const distanceMove = Math.sqrt(dxMove * dxMove + dyMove * dyMove);

        if (distanceMove < 100) {
            if (dxMove < -20) moveLeft = true;
            if (dxMove > 20) moveRight = true;
        }

        // ===== ЗОНА ПРЫЖКА =====
        const jumpZoneX = canvas.width - 150;
        const jumpZoneY = canvas.height - 150;

        const dxJump = pos.x - jumpZoneX;
        const dyJump = pos.y - jumpZoneY;
        const distanceJump = Math.sqrt(dxJump * dxJump + dyJump * dyJump);

        if (distanceJump < 80) {
            jumpPressed = true;
        }
    }

    // применяем движение
    player.moveLeft = moveLeft;
    player.moveRight = moveRight;

    // прыжок (без дабл-джампа)
    if (jumpPressed && player.onGround) {
        player.jump();
    }
}

// ПК управление
window.addEventListener("keydown", (e) => {

    if (e.key === "ArrowLeft" || e.key === "a") player.moveLeft = true;
    if (e.key === "ArrowRight" || e.key === "d") player.moveRight = true;
    if (e.key === " " ) player.jump();
});

window.addEventListener("keyup", (e) => {

    if (e.key === "ArrowLeft" || e.key === "a") player.moveLeft = false;
    if (e.key === "ArrowRight" || e.key === "d") player.moveRight = false;
});


// отрисовка зон управления
function drawUI() {
    if (!input.isMobile) return;

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "black";

    // левая зона движения
    ctx.beginPath();
    ctx.arc(150, canvas.height - 150, 100, 0, Math.PI * 2);
    ctx.fill();

    // правая зона прыжка
    ctx.beginPath();
    ctx.arc(canvas.width - 150, canvas.height - 150, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}