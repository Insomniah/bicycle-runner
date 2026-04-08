// controls.js – мобильное управление: зоны движения и прыжка
import { canvas, ctx } from './game.js';
import { player } from './player.js';
import { gameState, GameState } from './core/stateMachine.js';
import { gameStore } from './core/gameStore.js';

export const input = {
  isMobile: 'ontouchstart' in window
};

// Состояние активных касаний
let activeTouches = new Map(); // key: identifier, value: { type: 'left'|'right'|'jump' }

// Функция определения зоны касания
function getTouchZone(touchX, touchY) {
  const screenWidth = canvas.width;
  const screenHeight = canvas.height;
  
  // Зона прыжка: верхняя треть экрана
  if (touchY < screenHeight / 3) {
    return 'jump';
  }
  // Зона движения: левая половина экрана – влево, правая – вправо
  if (touchX < screenWidth / 2) {
    return 'left';
  } else {
    return 'right';
  }
}

// Обновление состояния движения игрока на основе активных касаний
function updatePlayerMovement() {
  let moveLeft = false;
  let moveRight = false;
  for (const touch of activeTouches.values()) {
    if (touch.type === 'left') moveLeft = true;
    if (touch.type === 'right') moveRight = true;
  }
  player.moveLeft = moveLeft;
  player.moveRight = moveRight;
}

function handleTouchStart(e) {
  e.preventDefault();
  for (const touch of e.touches) {
    const rect = canvas.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    const zone = getTouchZone(touchX, touchY);
    
    if (zone === 'jump') {
      if (!activeTouches.has(touch.identifier)) {
        activeTouches.set(touch.identifier, { type: 'jump' });
        if (player.onGround && gameState.state === GameState.PLAYING) {
          player.jump();
        }
      }
    } else {
      // Движение: если уже есть активное касание того же типа, не добавляем повторно
      let alreadyExists = false;
      for (const t of activeTouches.values()) {
        if (t.type === zone) {
          alreadyExists = true;
          break;
        }
      }
      if (!alreadyExists) {
        activeTouches.set(touch.identifier, { type: zone });
      }
    }
    updatePlayerMovement();
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  // При движении не меняем зоны, только если палец перешёл в другую зону – можно обновить, но для простоты игнорируем
  // Чтобы избежать залипания, можно пересчитать зоны, но лучше оставить как есть.
}

function handleTouchEnd(e) {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (activeTouches.has(touch.identifier)) {
      activeTouches.delete(touch.identifier);
    }
  }
  updatePlayerMovement();
}

// Инициализация мобильного управления
if (input.isMobile) {
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
  canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });
}

// Клавиатурное управление (для ПК)
window.addEventListener("keydown", (e) => {
  if (e.code === 'Backquote') {
    e.preventDefault();
    gameStore.toggleDebugMode();
    console.log("Debug mode:", gameStore.debugMode ? "ON" : "OFF");
  }
  if (e.key === "ArrowLeft" || e.key === "a") {
    player.moveLeft = true;
    player.moveRight = false;
  }
  if (e.key === "ArrowRight" || e.key === "d") {
    player.moveRight = true;
    player.moveLeft = false;
  }
  if (e.key === " ") {
    e.preventDefault();
    if (player.onGround && gameState.state === GameState.PLAYING) player.jump();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") player.moveLeft = false;
  if (e.key === "ArrowRight" || e.key === "d") player.moveRight = false;
});

// Отрисовка зон (опционально, для отладки)
export function drawUI() {
  if (!input.isMobile) return;
  if (!gameStore.debugMode) return; // рисуем только в режиме отладки
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#888";
  
  // Зона прыжка (верхняя треть)
  ctx.fillRect(0, 0, canvas.width, canvas.height / 3);
  
  // Левая зона движения
  ctx.fillStyle = "#44f";
  ctx.fillRect(0, canvas.height / 3, canvas.width / 2, canvas.height * 2 / 3);
  
  // Правая зона движения
  ctx.fillStyle = "#4f4";
  ctx.fillRect(canvas.width / 2, canvas.height / 3, canvas.width / 2, canvas.height * 2 / 3);
  
  ctx.restore();
}