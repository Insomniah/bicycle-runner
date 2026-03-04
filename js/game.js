// canvas и контекст
window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");

// базовое разрешение
canvas.width = 1280;
canvas.height = 720;

// глобальный масштаб
window.scale = 1;

// камера
window.camera = { x: 0, y: 0 };

// адаптация под экран
function resize() {
    const scaleX = window.innerWidth / canvas.width;
    const scaleY = window.innerHeight / canvas.height;

    scale = Math.min(scaleX, scaleY);

    canvas.style.width = canvas.width * scale + "px";
    canvas.style.height = canvas.height * scale + "px";
}

window.addEventListener("resize", resize);
resize();