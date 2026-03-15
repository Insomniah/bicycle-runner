window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");

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

// ===============================
// Resize и адаптивность canvas
// ===============================
function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    canvas.width = vw;
    canvas.height = vh;

    // Перегенерируем объекты, зависящие от размеров
    if (window.sky && sky.generate) sky.generate();
    if (window.mountains && mountains.generate) mountains.generate();
}

// запуск resize
resize();

// слушатели resize
window.addEventListener("resize", resize);
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
}
window.addEventListener("orientationchange", resize);