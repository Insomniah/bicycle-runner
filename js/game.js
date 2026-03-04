// canvas и контекст
window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");

// глобальный масштаб
window.scale = 1;

// камера
window.camera = { x: 0, y: 0 };

// адаптация под экран
function resize() {
    const height = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

    const width = window.visualViewport
        ? window.visualViewport.width
        : window.innerWidth;

    canvas.width = width;
    canvas.height = height;

    scale = 1;
}

window.addEventListener("resize", resize);

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
}

resize();

window.addEventListener("resize", resize);
resize();