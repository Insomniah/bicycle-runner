window.levelWidth = 4000; // длина уровня в пикселях

// canvas и контекст
window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");

// глобальный масштаб
window.scale = 1;

// адаптация под экран
function resize() {
    const height = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

    const width = window.visualViewport
        ? window.visualViewport.width
        : window.innerWidth;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    scale = 1;
}

window.addEventListener("resize", resize);

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
}

resize();

window.addEventListener("resize", resize);
resize();