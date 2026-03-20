window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");
window.DEBUG = true;

window.gameOver = false;

// ===============================
// Проверка ориентации для таблички
// ===============================
function updateRotateNotice() {
    const notice = document.getElementById("rotateNotice");
    if (!notice) return;

    // реальные размеры экрана
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // вертикально — показываем
    if (vh > vw) {
        notice.style.display = "flex";
    } else {
        // горизонтально — скрываем
        notice.style.display = "none";
    }
}

// проверка сразу после запуска
updateRotateNotice();

// проверка при изменении размера или повороте
window.addEventListener("resize", updateRotateNotice);
window.addEventListener("orientationchange", updateRotateNotice);