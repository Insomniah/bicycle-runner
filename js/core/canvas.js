// core/canvas.js – модуль работы с canvas
export const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("Canvas element #gameCanvas not found");
export const ctx = canvas.getContext("2d");

let sceneScale = 1;

function updateSceneScale() {
  const baseHeight = 800;
  sceneScale = canvas.height / baseHeight;
}

export function resizeCanvas() {
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  canvas.width = vw;
  canvas.height = vh;
  updateSceneScale();
}

export function rebuildWorld() {
  if (!window.clearLayer || !window.addToLayer) {
    console.warn("Layers not ready yet");
    return;
  }

  window.clearLayer("world");

  const level = window.game.world.currentLevel;
  if (!level) return;

  if (level.generate) level.generate();

  for (const p of level.platforms) {
    window.addToLayer("world", p);
  }
  for (const p of level.groundPlatforms) {
    window.addToLayer("world", p);
  }

  if (window.game && window.game.player && level) {
    window.game.player.y = level.getGroundBase() - window.game.player.height;
  }
}

// События (оставляем глобальные, но можно и экспортировать инициализатор)
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 200);
});

// Для обратной совместимости (старый код может использовать глобальные)
window.resizeCanvas = resizeCanvas;
window.rebuildWorld = rebuildWorld;