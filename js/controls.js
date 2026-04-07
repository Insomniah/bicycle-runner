// controls.js – модуль управления с виртуальным джойстиком и кнопкой прыжка
import { canvas, ctx } from './game.js';
import { player } from './player.js';
import { gameState, GameState } from './core/stateMachine.js';
import { gameStore } from './core/gameStore.js';
import { VirtualJoystick } from './ui/virtualJoystick.js';
import { JumpButton } from './ui/jumpButton.js';

export const input = {
  isMobile: 'ontouchstart' in window
};

// Создаём экземпляры джойстика и кнопки
export const joystick = new VirtualJoystick({ radius: 70 });
export const jumpButton = new JumpButton({ radius: 60 });

// Функция для установки позиций (вызывается при изменении canvas)
export function updateUIPositions() {
  if (!canvas) return;
  joystick.setPosition(canvas.height);
  jumpButton.setPosition(canvas.width, canvas.height);
}

function handleTouchStart(e) {
  e.preventDefault();
  for (const touch of e.touches) {
    // Сначала проверяем кнопку прыжка
    if (jumpButton.handleStart(touch, canvas)) {
      if (player.onGround && gameState.state === GameState.PLAYING) {
        player.jump();
      }
      continue;
    }
    // Потом джойстик
    joystick.handleStart(touch, canvas);
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  for (const touch of e.touches) {
    // Обновляем джойстик
    joystick.handleMove(touch, canvas);
    // Кнопка прыжка не обрабатывает движение
  }
  // Обновляем движение игрока на основе джойстика
  if (joystick.active) {
    const threshold = 0.2; // зона мёртвой зоны
    if (joystick.deltaX < -threshold) {
      player.moveLeft = true;
      player.moveRight = false;
    } else if (joystick.deltaX > threshold) {
      player.moveLeft = false;
      player.moveRight = true;
    } else {
      player.moveLeft = false;
      player.moveRight = false;
    }
  } else {
    player.moveLeft = false;
    player.moveRight = false;
  }
}

function handleTouchEnd(e) {
  e.preventDefault();
  for (const touch of e.touches) {
    if (jumpButton.handleEnd(touch)) {
      // Кнопка отпущена, ничего не делаем
    }
    joystick.handleEnd(touch);
  }
  // Если не осталось активных касаний, выключаем движение
  if (e.touches.length === 0) {
    player.moveLeft = false;
    player.moveRight = false;
  }
}

// Инициализация мобильного управления
if (input.isMobile) {
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
  canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });
  // Устанавливаем начальные позиции
  updateUIPositions();
}

// Клавиатурное управление (для ПК и отладки)
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

// Отрисовка UI (джойстик и кнопка)
export function drawUI() {
  if (!input.isMobile) return;
  joystick.draw(ctx);
  jumpButton.draw(ctx);
}