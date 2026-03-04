// canvas и контекст
window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");

// глобальный масштаб
window.scale = 1;

// камера
window.camera = { x: 0, y: 0 };

// адаптация под экран
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    scale = 1; // больше не нужен масштаб, работаем напрямую в размере экрана
}

window.addEventListener("resize", resize);
resize();