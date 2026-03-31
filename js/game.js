window.canvas = document.getElementById("gameCanvas");
window.ctx = canvas.getContext("2d");
window.DEBUG = true;

window.gameOver = false;

// ===============================
// Проверка ориентации для таблички
// ===============================
function updateRotateNotice() {
    const notice = document.getElementById("rotateNotice");
    if (!notice) return;

    // реальные размеры экрана
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // вертикально — показываем
    if (vh > vw) {
        notice.style.display = "flex";
    } else {
        // горизонтально — скрываем
        notice.style.display = "none";
    }
}


// проверка сразу после запуска
updateRotateNotice();

// ===============================
// Game Over UI
// ===============================
window.gameOverUI = {
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

// Привязываем к window.game для доступа из других модулей
window.game = window.game || {};
window.game.gameOverUI = window.gameOverUI;

// реальные размеры окна браузера на мобильных устройствах для правильного масштабирования
function setRealVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setRealVH();
window.addEventListener('resize', setRealVH);
window.addEventListener('orientationchange', setRealVH);

// проверка при изменении размера или повороте
window.addEventListener("resize", updateRotateNotice);
window.addEventListener("orientationchange", updateRotateNotice);

gameOverUI.init();
window.game.gameOverUI = window.gameOverUI;