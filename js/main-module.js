// main-module.js – точка входа в игру (модуль)
import { resizeCanvas, rebuildWorld } from './core/canvas.js';
import { addToLayer, drawLayers } from './core/layers.js';
import { world } from './world.js';
import { player } from './player.js';
import { camera } from './camera.js';
import { drawUI } from './controls.js';
import { gameOverUI } from './game.js';
import { skyBackground } from './scenery/skybackground.js';
import { sky } from './scenery/sky.js';
import { background } from './scenery/background.js';
import { decorations } from './scenery/decorations.js';
import { level1 } from '../levels/level1.js';
import { level2 } from '../levels/level2.js';

// Глобальные объекты
window.game = window.game || {};
window.game.state = {
  gameOver: false,
  nextLevelQueued: false,
  restarting: false,
  debugMode: false,
  wheelsCollected: 0,
};
window.game.player = player;
window.game.world = world;
window.game.camera = camera;
window.game.gameOverUI = gameOverUI;
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
  // Игрок
  const playerImg = await loadImage("assets/player/player.png");
  player.sprite = playerImg;

  // Фоны
  const mountainsImg = await loadImage(CONFIG.BACKGROUND_MOUNTAINS);
  window.preloadedBackgrounds[CONFIG.BACKGROUND_MOUNTAINS] = mountainsImg;
  background.setImage(mountainsImg, CONFIG.BACKGROUND_MOUNTAINS);

  const factoriesImg = await loadImage(CONFIG.BACKGROUND_FACTORIES);
  window.preloadedBackgrounds[CONFIG.BACKGROUND_FACTORIES] = factoriesImg;

  // Камни
  const rockPromises = decorations.rockTypes.map(t => loadImage(t.src));
  const rockImages = await Promise.all(rockPromises);
  decorations.setRockImages(rockImages);

  // Шины
  const tirePromises = decorations.tireTypes.map(t => loadImage(t.src));
  const tireImages = await Promise.all(tirePromises);
  decorations.setTireImages(tireImages);

  // Колёса
  const wheelImg = await loadImage("assets/objects/wheel.png");
  window.wheelSprite = wheelImg;

  console.log("All images loaded");
  decorations.loaded = true;
  if (world.currentLevel) decorations.generate();
}

window.game.restart = function() {
  const state = window.game.state;
  if (state.restarting) return;
  state.restarting = true;
  try {
    if (!world.currentLevel) return;
    world.currentLevel.generate();
    decorations.generate();
    rebuildWorld();
    world.generateWheels(world.currentLevel);
    player.initPosition();
    player.autoMove = false;
    player.moveLeft = false;
    player.moveRight = false;
    state.gameOver = false;
    state.wheelsCollected = 0;
    gameOverUI.hide();
  } finally {
    state.restarting = false;
  }
};

window.game.drawDebug = function() {
  if (!ctx || !window.game.state.debugMode) return;
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

  ctx.fillStyle = CONFIG.DEBUG_COLOR;
  ctx.font = CONFIG.DEBUG_FONT;
  ctx.textAlign = "left";

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

document.addEventListener('DOMContentLoaded', async () => {
  resizeCanvas();

  world.sky = sky;
  world.background = background;

  await loadAllImages();

  // Уровни должны быть глобальными (подключены в HTML)
  world.setLevel(level1);
  window.game.state.wheelsCollected = 0;

  addToLayer("background", skyBackground);
  addToLayer("background", sky);
  addToLayer("background", background);
  addToLayer("midground", decorations);

  rebuildWorld();

  let lastTime = performance.now();
  function gameLoop(time) {
    let dt = Math.min(0.033, (time - lastTime) / 1000);
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.update();
    player.update(dt);
    world.update(dt);

    drawLayers(ctx, camera);
    world.drawWheels(ctx, camera);
    player.draw(ctx, camera);
    drawUI();
    drawWheelCounter();
    window.game.drawDebug();

    const state = window.game.state;
    if (state.gameOver) {
      gameOverUI.show(state.gameOver === "complete");
      if (state.gameOver === "complete" && !state.nextLevelQueued && !state.restarting) {
        state.nextLevelQueued = true;
        setTimeout(() => {
          world.setLevel(level2);
          rebuildWorld();
          state.gameOver = false;
          state.nextLevelQueued = false;
          state.wheelsCollected = 0;
          gameOverUI.hide();
        }, CONFIG.LEVEL_SWITCH_DELAY);
      }
    }

    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
});