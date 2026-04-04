// game.js – глобальные объекты canvas и UI (модуль)
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
window.DEBUG = true;

function updateRotateNotice() {
  const notice = document.getElementById("rotateNotice");
  if (!notice) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vh > vw) {
    notice.style.display = "flex";
  } else {
    notice.style.display = "none";
  }
}
updateRotateNotice();

export const gameOverUI = {
  root: null,
  text: null,
  button: null,

  init() {
    this.root = document.getElementById("game-over");
    this.text = document.getElementById("game-over-text");
    this.button = document.getElementById("restart-button");
    this.button.addEventListener("click", () => {
      window.game.restart();
      this.hide();
    });
  },

  show(isComplete) {
    if (!this.root) return;
    this.text.textContent = isComplete ? "Stage Complete" : "Game Over";
    this.button.style.display = isComplete ? "none" : "inline-block";
    this.root.classList.remove("hidden");
  },

  hide() {
    if (!this.root) return;
    this.root.classList.add("hidden");
  },
};

window.game = window.game || {};
window.game.gameOverUI = gameOverUI;

function setRealVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setRealVH();
window.addEventListener('resize', setRealVH);
window.addEventListener('orientationchange', setRealVH);
window.addEventListener("resize", updateRotateNotice);
window.addEventListener("orientationchange", updateRotateNotice);

gameOverUI.init();

// Для обратной совместимости
window.canvas = canvas;
window.ctx = ctx;