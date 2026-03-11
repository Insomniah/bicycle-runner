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
// Пересчёт размеров canvas
// ===============================

function resize() {

    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;

    canvas.width = vw;
    canvas.height = vh;

}


// ===============================
// Полный перерасчёт сцены
// ===============================

function recalcScene() {

    resize();

    // Перегенерируем объекты,
    // которые зависят от размера экрана
    if (typeof sky !== "undefined" && sky.generate) {
        sky.generate();
    }

    if (typeof mountains !== "undefined" && mountains.generate) {
        mountains.generate();
    }

}


// первый запуск
recalcScene();


// ===============================
// События изменения размера
// ===============================

window.addEventListener("resize", recalcScene);


// мобильные браузеры иногда обновляют viewport
// только спустя время после поворота
window.addEventListener("orientationchange", () => {
    setTimeout(recalcScene, 200);
});