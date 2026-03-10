window.levelWidth = 4000; // длина уровня в пикселях

// canvas и контекст
window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");

// глобальный масштаб
window.scale = 1;

// адаптация под экран
function resize() {

    // Используем именно visualViewport, если он доступен
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;

    canvas.width = vw;
    canvas.height = vh;

    // Важно: пересчитываем масштаб или позиции UI, если они зависят от высоты
    if (window.sky && sky.generate) {
        sky.generate();
    }

    if (window.mountains && mountains.generate) {
        mountains.generate();
    }

}


window.addEventListener("resize", resize);

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
}

resize();

window.addEventListener("resize", resize);
resize();