// main.js – игровой цикл, инициализация, рестарт, debug (с поддержкой смены фона)

if (typeof CONFIG === 'undefined') {
  console.error("CONFIG not loaded! Check script order.");
}

window.game = window.game || {};
window.game.state = {
  gameOver: false,
  nextLevelQueued: false,
  restarting: false,
  debugMode: false,
  wheelsCollected: 0,
};
window.game.gameOverUI = window.gameOverUI;

// Хранилище предзагруженных фоновых изображений
window.preloadedBackgrounds = {};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadAllImages() {
  // Загрузка игрока
  const playerImg = await loadImage("assets/player/player.png");
  window.game.player.sprite = playerImg;

  // Загрузка фонов
  const mountainsImg = await loadImage(CONFIG.BACKGROUND_MOUNTAINS);
  window.preloadedBackgrounds[CONFIG.BACKGROUND_MOUNTAINS] = mountainsImg;
  if (background && !background.loaded) {
    background.setImage(mountainsImg, CONFIG.BACKGROUND_MOUNTAINS);
  }

  const factoriesImg = await loadImage(CONFIG.BACKGROUND_FACTORIES);
  window.preloadedBackgrounds[CONFIG.BACKGROUND_FACTORIES] = factoriesImg;

  // Загрузка камней
  if (decorations.rockTypes && decorations.rockTypes.length) {
    const rockPromises = decorations.rockTypes.map(type => loadImage(type.src));
    const rockImages = await Promise.all(rockPromises);
    decorations.rockImages = rockImages;
    decorations.setRockImages(rockImages);
  }

  // Загрузка шин
  if (decorations.tireTypes && decorations.tireTypes.length) {
    const tirePromises = decorations.tireTypes.map(type => loadImage(type.src));
    const tireImages = await Promise.all(tirePromises);
    decorations.tireImages = tireImages;
    decorations.setTireImages(tireImages);
  }

  // Загрузка колёс
  const wheelSpriteImg = await loadImage("assets/objects/wheel.png");
  window.wheelSprite = wheelSpriteImg;

  console.log("All images loaded");
  decorations.loaded = true;

  // Если уровень уже установлен, генерируем камни/шины
  if (window.game.world && window.game.world.currentLevel) {
    decorations.generate();
  }
}

// ===============================
// Методы game
// ===============================
window.game.restart = function() {
  const state = window.game.state;
  if (state.restarting) return;
  state.restarting = true;
  try {
    if (!window.game.world.currentLevel) return;
    window.game.world.currentLevel.generate();
    decorations.generate();
    rebuildWorld();
    
    // ПЕРЕСОЗДАЁМ КОЛЁСА
    window.game.world.generateWheels(window.game.world.currentLevel);
    window.game.player.initPosition();

    window.game.player.autoMove = false;
    window.game.player.moveLeft = false;
    window.game.player.moveRight = false;

    state.gameOver = false;
    state.wheelsCollected = 0;
    if (window.game.gameOverUI && window.game.gameOverUI.hide) {
      window.game.gameOverUI.hide();
    }
  } finally {
    state.restarting = false;
  }
};

window.game.drawDebug = function() {
  if (!ctx) return;
  const debugMode = window.game.state.debugMode;
  if (!debugMode) return;

  ctx.fillStyle = CONFIG.DEBUG_COLOR;
  ctx.font = CONFIG.DEBUG_FONT;
  ctx.textAlign = "left";

  const player = window.game.player;
  const camera = window.game.camera;
  const level = window.game.world.currentLevel;
  if (!player || !camera || !level) return;

  const x = player.x - camera.x;
  const y = player.y - camera.y;
  const rightX = x + player.width;
  const bottomY = y + player.height;

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, player.width, player.height);
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, player.width, player.height);
  ctx.restore();

  let lines = [
    `PLAYER: x=${player.x.toFixed(1)}, y=${player.y.toFixed(1)}, vy=${player.vy.toFixed(2)}, onGround=${player.onGround}`,
    `LEVEL: ${level.number} Size: ${level.width} X ${level.height}`,
    `GAME: ${window.game.state.gameOver || "running"}`,
    `HITBOX: left=${x.toFixed(1)}, top=${y.toFixed(1)}, right=${rightX.toFixed(1)}, bottom=${bottomY.toFixed(1)}, width=${player.width}, height=${player.height}`,
    `COYOTE: ${player.coyoteTimer.toFixed(3)}`
  ];

  lines.forEach((line, i) => {
    ctx.fillText(line, 10, 20 + i * 18);
  });
};

function drawWheelCounter() {
  if (!ctx) return;
  ctx.fillStyle = "white";
  ctx.font = "24px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`🔄 ${window.game.state.wheelsCollected}`, canvas.width - 20, 40);
}

// ===============================
// Инициализация мира и уровней
// ===============================
window.game.world.sky = sky;
window.game.world.mountains = background; // world.js ожидает this.mountains

loadAllImages().then(() => {
  // Убедимся, что у background есть изображение (если ещё не установлено)
  if (background && !background.loaded && window.preloadedBackgrounds[CONFIG.BACKGROUND_MOUNTAINS]) {
    background.setImage(window.preloadedBackgrounds[CONFIG.BACKGROUND_MOUNTAINS], CONFIG.BACKGROUND_MOUNTAINS);
  }

  window.game.world.setLevel(level1);
  window.game.state.wheelsCollected = 0;

  addToLayer("background", skyBackground);
  addToLayer("background", sky);
  addToLayer("background", background);
  addToLayer("midground", decorations);

  resizeCanvas();
  rebuildWorld();

  requestAnimationFrame(gameLoop);
}).catch(err => {
  console.error("Critical error during image loading", err);
});

// ===============================
// Игровой цикл
// ===============================
let lastTime = performance.now();

function gameLoop(time) {
  if (!gameLoop.lastTime) gameLoop.lastTime = time;
  let dt = (time - gameLoop.lastTime) / 1000;
  const maxDt = CONFIG.MAX_DT;
  if (dt > maxDt) dt = maxDt;
  gameLoop.lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (window.game.camera && window.game.camera.update) window.game.camera.update();
  if (window.game.player && window.game.player.update) window.game.player.update(dt);
  if (window.game.world && window.game.world.update) window.game.world.update(dt);

  drawLayers(ctx, window.game.camera);
  if (window.game.world && window.game.world.drawWheels) window.game.world.drawWheels(ctx, window.game.camera);
  window.game.player.draw(ctx, window.game.camera);
  if (window.drawUI) drawUI();
  drawWheelCounter();
  window.game.drawDebug();

  const state = window.game.state;
  if (state.gameOver) {
    if (window.game.gameOverUI && window.game.gameOverUI.show) {
      window.game.gameOverUI.show(state.gameOver === "complete");
    }

    if (state.gameOver === "complete" && !state.nextLevelQueued && !state.restarting) {
      state.nextLevelQueued = true;

      setTimeout(() => {
        console.log("switching level...");
        window.game.world.setLevel(level2);
        rebuildWorld();
        state.gameOver = false;
        state.nextLevelQueued = false;
        state.wheelsCollected = 0;
        if (window.game.gameOverUI && window.game.gameOverUI.hide) {
          window.game.gameOverUI.hide();
        }
      }, CONFIG.LEVEL_SWITCH_DELAY);
    }
  }

  requestAnimationFrame(gameLoop);
}