const canvas = document.getElementById("gameCanvas");

if (!canvas) {
    throw new Error("Canvas element #gameCanvas not found");
}

const ctx = canvas.getContext("2d");

// ===============================
// Масштаб сцены
// ===============================
let sceneScale = 1;

function updateSceneScale() {
    const baseHeight = 800;
    sceneScale = canvas.height / baseHeight;
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
    updateSceneScale();

    // ===== защита от раннего вызова =====
    if (!window.clearLayer || !window.addToLayer) {
        console.warn("Layers not ready yet");
        return;
    }

    clearLayer("world");

    // ===== УРОВЕНЬ =====
    const level = window.world.currentLevel;

    if (level && level.generate) {
        level.generate();

        for (const p of level.platforms) {
            addToLayer("world", p);
        }

        for (const p of level.groundPlatforms) {
            addToLayer("world", p);
        }
    }

    if (window.player && level) {
        player.y = level.getGroundBase() - player.height;
    }
}

// ===============================
// События изменения размера
// ===============================
window.addEventListener("resize", recalcScene);
window.addEventListener("orientationchange", () => {
    setTimeout(recalcScene, 200);
});

// ===============================
// Первый запуск
// ===============================
window.addEventListener("load", recalcScene);