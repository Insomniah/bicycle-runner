const canvas = document.getElementById("gameCanvas");

if (!canvas) {
    throw new Error("Canvas element #gameCanvas not found");
}

const ctx = canvas.getContext("2d");


// ===============================
// Масштаб сцены
// ===============================

// Эталонная высота сцены
// От неё масштабируются все объекты
function getSceneScale() {

    const baseHeight = 800;
    return canvas.height / baseHeight;

}


// ===============================
// Адаптация canvas под экран
// ===============================

function resize() {

    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;

    canvas.width = vw;
    canvas.height = vh;

}

resize();

window.addEventListener("resize", resize);

// фиксим поворот телефона
window.addEventListener("orientationchange", () => {
    setTimeout(resize, 200);
});