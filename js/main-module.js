// main-module.js – точка входа с конечным автоматом, gameStore и загрузкой уровней из JSON
import { resizeCanvas, rebuildWorld } from './core/canvas.js';
import { addToLayer, drawLayers } from './core/layers.js';
import { assetManager } from './core/assetManager.js';
import { eventBus } from './core/eventBus.js';
import { gameState, GameState } from './core/stateMachine.js';
import { gameStore } from './core/gameStore.js';
import { world } from './world.js';
import { player } from './player.js';
import { camera } from './camera.js';
import { drawUI } from './controls.js';
import { gameOverUI } from './game.js';
import { skyBackground } from './scenery/skybackground.js';
import { sky } from './scenery/sky.js';
import { background } from './scenery/background.js';
import { decorations } from './scenery/decorations.js';
import { Platform } from './entities/platform.js';
import { updateUIPositions } from './controls.js';

window.game = window.game || {};
window.game.player = player;
window.game.world = world;
window.game.camera = camera;
window.game.gameOverUI = gameOverUI;
window.game.eventBus = eventBus;

if (window._pendingPlayerSprite) {
  window.game.player.sprite = window._pendingPlayerSprite;
  delete window._pendingPlayerSprite;
}

async function loadLevels() {
  const [level1Data, level2Data] = await Promise.all([
    fetch('../levels/level1.json').then(r => r.json()),
    fetch('../levels/level2.json').then(r => r.json())
  ]);

  function enhanceLevel(data) {
    return {
      ...data,
      platforms: [],
      groundPlatforms: [],
      getGroundBase() {
        return this.groundY;
      },
      generate() {
        this.platforms = [];
        const base = this.getGroundBase();
        for (const p of this.platformData) {
          this.platforms.push(new Platform(p.x, base - p.offset, p.w, p.h));
        }
        this.groundPlatforms = [];
        for (const gp of this.groundPlatformsData) {
          this.groundPlatforms.push(new Platform(gp.x, base, gp.width, 200));
        }
      }
    };
  }

  return [enhanceLevel(level1Data), enhanceLevel(level2Data)];
}

window.game.restart = function() {
  if (gameState.state === GameState.SWITCHING_LEVEL) return;
  if (!world.currentLevel) return;
  world.currentLevel.generate();
  decorations.generate();
  rebuildWorld();
  world.generateWheels(world.currentLevel);
  player.initPosition();
  player.autoMove = false;
  player.moveLeft = false;
  player.moveRight = false;
  gameStore.resetWheels();
  gameOverUI.hide();
  gameState.transition('restart');
};

window.game.drawDebug = function() {
  if (!ctx || !gameStore.debugMode) return;
  const camera = window.game.camera;
  const level = world.currentLevel;
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
    `GAME: ${gameState.state}`,
    `HITBOX: left=${x.toFixed(1)}, top=${y.toFixed(1)}, right=${rightX.toFixed(1)}, bottom=${bottomY.toFixed(1)}`,
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
  ctx.fillText(`🔄 ${gameStore.wheelsCollected}`, canvas.width - 20, 40);
}

eventBus.on('state.level_complete', () => {
  gameOverUI.show(true);
  setTimeout(() => {
    if (gameState.state === GameState.LEVEL_COMPLETE) {
      gameState.transition('switch');
      world.setLevel(window._cachedLevel2);
      rebuildWorld();
      gameStore.resetWheels();
      gameOverUI.hide();
      gameState.transition('start');
    }
  }, CONFIG.LEVEL_SWITCH_DELAY);
});

eventBus.on('state.game_over', () => {
  gameOverUI.show(false);
});

eventBus.on('state.playing', () => {});

eventBus.on('game.restart', () => {
  window.game.restart();
});

document.addEventListener('DOMContentLoaded', async () => {
  resizeCanvas();
  updateUIPositions();
  world.sky = sky;
  world.background = background;
  await assetManager.loadAllAssets();
  if (!player.sprite) player.sprite = assetManager.get('player');
  const mountainsImg = assetManager.get('mountains_bg');
  if (mountainsImg && background && !background.loaded) {
    background.setImage(mountainsImg, CONFIG.BACKGROUND_MOUNTAINS);
  }

  const [level1, level2] = await loadLevels();
  window._cachedLevel2 = level2; // кешируем второй уровень
  world.setLevel(level1);
  gameStore.resetWheels();
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
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
});

window.addEventListener('resize', () => {
  resizeCanvas();
  updateUIPositions();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    resizeCanvas();
    updateUIPositions();
  }, 100); // небольшая задержка, чтобы браузер обновил размеры
});