// controls.js – улучшенное мобильное управление с динамическим масштабом
import { canvas, ctx } from './game.js';
import { player } from './player.js';
import { gameState, GameState } from './core/stateMachine.js';
import { gameStore } from './core/gameStore.js';
import { VirtualJoystick } from './ui/VirtualJoystick.js';
import { JumpButton } from './ui/JumpButton.js';

export const input = {
  isMobile: 'ontouchstart' in window
};

let joystick = null;
let jumpButton = null;

// Функция для получения радиуса в зависимости от размера экрана
function getUIRadius() {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return 70; // fallback
  const base = Math.min(canvas.width, canvas.height);
  let radius = base * 0.2; // 20% от меньшей стороны
  // Ограничиваем от 60 до 120 пикселей
  radius = Math.min(120, Math.max(60, radius));
  return radius;
}

// Обновление позиций и размеров UI
export function updateUIPositions() {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return;

  const radius = getUIRadius();
  const margin = Math.min(canvas.width, canvas.height) * 0.05; // 5% отступ

  if (!joystick) {
    joystick = new VirtualJoystick({ radius });
    jumpButton = new JumpButton({ radius: radius * 0.9 });
  } else {
    joystick.radius = radius;
    jumpButton.radius = radius * 0.9;
  }

  // Джойстик слева снизу
  joystick.setPosition(
    margin + joystick.radius,
    canvas.height - margin - joystick.radius
  );

  // Кнопка прыжка справа снизу
  jumpButton.setPosition(
    canvas.width - margin - jumpButton.radius,
    canvas.height - margin - jumpButton.radius
  );
}

// Инициализация позиций после загрузки canvas
if (input.isMobile) {
  // Не вызываем сразу, дождёмся первого ресайза
  window.addEventListener('resize', updateUIPositions);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateUIPositions, 50);
  });
}

// Обработчики касаний
function handleTouchStart(e) {
  e.preventDefault();
  if (!joystick || !jumpButton) return;
  for (const touch of e.touches) {
    if (jumpButton.handleStart(touch, canvas)) {
      if (player.onGround && gameState.state === GameState.PLAYING) {
        player.jump();
      }
      continue;
    }
    joystick.handleStart(touch, canvas);
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!joystick) return;
  for (const touch of e.touches) {
    joystick.handleMove(touch, canvas);
  }
  // Обновляем движение игрока
  if (joystick.active) {
    const threshold = 0.2;
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
  if (!joystick || !jumpButton) return;
  for (const touch of e.touches) {
    jumpButton.handleEnd(touch);
    joystick.handleEnd(touch);
  }
  if (e.touches.length === 0) {
    player.moveLeft = false;
    player.moveRight = false;
  }
}

if (input.isMobile) {
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
  canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });
}

// Клавиатурное управление
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

export function drawUI() {
  if (!input.isMobile) return;
  if (joystick) joystick.draw(ctx);
  if (jumpButton) jumpButton.draw(ctx);
}