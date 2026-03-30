// canvas.js

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("Canvas element #gameCanvas not found");
const ctx = canvas.getContext("2d");

let sceneScale = 1;

function updateSceneScale() {
    const baseHeight = 800;
    sceneScale = canvas.height / baseHeight;
}

function resizeCanvas() {
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    canvas.width = vw;
    canvas.height = vh;
    updateSceneScale();
}

function rebuildWorld() {
    if (!window.clearLayer || !window.addToLayer) {
        console.warn("Layers not ready yet");
        return;
    }

    clearLayer("world");

    const level = window.world.currentLevel;
    if (!level) return;

    if (level.generate) level.generate(); // перегенерирует платформы

    for (const p of level.platforms) {
        addToLayer("world", p);
    }
    for (const p of level.groundPlatforms) {
        addToLayer("world", p);
    }

    // Обновляем позицию игрока только если он существует и есть уровень
    if (window.game && window.game.player && level) {
        window.game.player.y = level.getGroundBase() - window.game.player.height;
    }
}

// Экспортируем функции в глобальную область (временно, пока не инкапсулировали всё в game)
window.resizeCanvas = resizeCanvas;
window.rebuildWorld = rebuildWorld;

// События изменения размера – только изменение canvas, без перестройки мира
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvas, 200);
});

// Первоначальный запуск: размер и сборка мира будут выполнены в main.js после загрузки