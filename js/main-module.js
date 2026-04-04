// main-module.js – точка входа в игру (модуль)
import { resizeCanvas, rebuildWorld } from './core/canvas.js';
import { addToLayer, drawLayers } from './core/layers.js';
import { assetManager } from './core/assetManager.js';
import { eventBus } from './core/eventBus.js';
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
window.game.eventBus = eventBus;

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

  await assetManager.loadAllAssets();

  if (!player.sprite) player.sprite = assetManager.get('player');
  const mountainsImg = assetManager.get('mountains_bg');
  if (mountainsImg && background && !background.loaded) {
    background.setImage(mountainsImg, CONFIG.BACKGROUND_MOUNTAINS);
  }

  world.setLevel(level1);
  window.game.state.wheelsCollected = 0;

  addToLayer("background", skyBackground);
  addToLayer("background", sky);
  addToLayer("background", background);
  addToLayer("midground", decorations);

  rebuildWorld();

  // Подписки на события
  eventBus.on('level.complete', () => {
    gameOverUI.show(true);
    if (!window.game.state.nextLevelQueued && !window.game.state.restarting) {
      window.game.state.nextLevelQueued = true;
      setTimeout(() => {
        world.setLevel(level2);
        rebuildWorld();
        window.game.state.gameOver = false;
        window.game.state.nextLevelQueued = false;
        window.game.state.wheelsCollected = 0;
        gameOverUI.hide();
      }, CONFIG.LEVEL_SWITCH_DELAY);
    }
  });

  eventBus.on('game.over', () => {
    gameOverUI.show(false);
  });

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

    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
});