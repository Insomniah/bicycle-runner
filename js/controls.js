// controls.js – обработка ввода с клавиатуры и тач-зон

if (typeof CONFIG === 'undefined') {
    console.error("CONFIG not loaded! Check script order.");
}

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
            window.game.player.moveLeft = false;
            window.game.player.moveRight = false;
        } else {
            handleTouch(e);
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

        // Зона движения (левая нижняя часть)
        const moveZoneX = CONFIG.TOUCH_MOVE_ZONE_X;
        const moveZoneY = canvas.height - CONFIG.TOUCH_MOVE_ZONE_Y_OFFSET;
        const dxMove = pos.x - moveZoneX;
        const dyMove = pos.y - moveZoneY;
        const distanceMove = Math.sqrt(dxMove * dxMove + dyMove * dyMove);
        if (distanceMove < CONFIG.TOUCH_MOVE_ZONE_RADIUS) {
            if (dxMove < -CONFIG.TOUCH_SWIPE_THRESHOLD) moveLeft = true;
            if (dxMove > CONFIG.TOUCH_SWIPE_THRESHOLD) moveRight = true;
        }

        // Зона прыжка (правая нижняя часть)
        const jumpZoneX = canvas.width - CONFIG.TOUCH_JUMP_ZONE_X_OFFSET;
        const jumpZoneY = canvas.height - CONFIG.TOUCH_JUMP_ZONE_Y_OFFSET;
        const dxJump = pos.x - jumpZoneX;
        const dyJump = pos.y - jumpZoneY;
        const distanceJump = Math.sqrt(dxJump * dxJump + dyJump * dyJump);
        if (distanceJump < CONFIG.TOUCH_JUMP_ZONE_RADIUS) {
            jumpPressed = true;
        }
    }

    window.game.player.moveLeft = moveLeft;
    window.game.player.moveRight = moveRight;
    if (jumpPressed && window.game.player.onGround) {
        window.game.player.jump();
    }
}

// ПК управление
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") window.game.player.moveLeft = true;
    if (e.key === "ArrowRight" || e.key === "d") window.game.player.moveRight = true;
    if (e.key === " ") {
        e.preventDefault(); // чтобы не прокручивало страницу
        window.game.player.jump();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") window.game.player.moveLeft = false;
    if (e.key === "ArrowRight" || e.key === "d") window.game.player.moveRight = false;
});

window.addEventListener("keydown", (e) => {
    // Переключение отладочного режима по клавише `ё` (Backquote)
    if (e.code === 'Backquote') {
        e.preventDefault(); // чтобы не вводить символ в консоль (если она открыта)
        window.game.state.debugMode = !window.game.state.debugMode;
        console.log("Debug mode:", window.game.state.debugMode ? "ON" : "OFF");
    }

    // Остальные клавиши (движение, прыжок)
    if (e.key === "ArrowLeft" || e.key === "a") window.game.player.moveLeft = true;
    if (e.key === "ArrowRight" || e.key === "d") window.game.player.moveRight = true;
    if (e.key === " ") window.game.player.jump();
});

// Отрисовка зон управления (для мобильных)
function drawUI() {
    if (!input.isMobile) return;

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(150, canvas.height - 150, 100, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(canvas.width - 150, canvas.height - 150, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}