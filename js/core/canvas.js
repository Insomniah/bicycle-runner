// core/canvas.js – модуль работы с canvas (без вызова updateUIPositions)
export const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("Canvas element #gameCanvas not found");
export const ctx = canvas.getContext("2d");

let sceneScale = 1;

function updateSceneScale() {
  const baseHeight = 800;
  sceneScale = canvas.height / baseHeight;
}

export function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateSceneScale();
  // updateUIPositions() вызывается в main-module.js, не нужно здесь
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

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 200);
});

window.resizeCanvas = resizeCanvas;
window.rebuildWorld = rebuildWorld;