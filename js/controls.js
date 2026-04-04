// controls.js – модуль управления (внедрение зависимости player)
import { canvas, ctx } from './game.js';
import { player } from './player.js';
import { gameState, GameState } from './core/stateMachine.js';

export const input = {
  left: false,
  right: false,
  down: false,
  jump: false,
  isMobile: 'ontouchstart' in window
};

function getGameCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

export function processTouches(touches, canvasWidth, canvasHeight, config) {
  let moveLeft = false;
  let moveRight = false;
  let jumpPressed = false;

  const moveZoneX = config.TOUCH_MOVE_ZONE_X;
  const moveZoneY = canvasHeight - config.TOUCH_MOVE_ZONE_Y_OFFSET;
  const moveRadius = config.TOUCH_MOVE_ZONE_RADIUS;
  const swipeThreshold = config.TOUCH_SWIPE_THRESHOLD;

  const jumpZoneX = canvasWidth - config.TOUCH_JUMP_ZONE_X_OFFSET;
  const jumpZoneY = canvasHeight - config.TOUCH_JUMP_ZONE_Y_OFFSET;
  const jumpRadius = config.TOUCH_JUMP_ZONE_RADIUS;

  for (const touch of touches) {
    const pos = getGameCoords(touch.clientX, touch.clientY);
    const dxMove = pos.x - moveZoneX;
    const dyMove = pos.y - moveZoneY;
    const distanceMove = Math.sqrt(dxMove * dxMove + dyMove * dyMove);
    if (distanceMove < moveRadius) {
      if (dxMove < -swipeThreshold) moveLeft = true;
      if (dxMove > swipeThreshold) moveRight = true;
    }

    const dxJump = pos.x - jumpZoneX;
    const dyJump = pos.y - jumpZoneY;
    const distanceJump = Math.sqrt(dxJump * dxJump + dyJump * dyJump);
    if (distanceJump < jumpRadius) {
      jumpPressed = true;
    }
  }

  return { moveLeft, moveRight, jumpPressed };
}

function handleTouch(e) {
  e.preventDefault();
  const commands = processTouches(e.touches, canvas.width, canvas.height, CONFIG);
  player.moveLeft = commands.moveLeft;
  player.moveRight = commands.moveRight;
  if (commands.jumpPressed && player.onGround && gameState.state === GameState.PLAYING) {
    player.jump();
  }
}

if (input.isMobile) {
  canvas.addEventListener("touchstart", handleTouch, { passive: false });
  canvas.addEventListener("touchmove", handleTouch, { passive: false });
  canvas.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) {
      player.moveLeft = false;
      player.moveRight = false;
    } else {
      handleTouch(e);
    }
  });
}

window.addEventListener("keydown", (e) => {
  if (e.code === 'Backquote') {
    e.preventDefault();
    window.game.state.debugMode = !window.game.state.debugMode;
    console.log("Debug mode:", window.game.state.debugMode ? "ON" : "OFF");
  }
  if (e.key === "ArrowLeft" || e.key === "a") player.moveLeft = true;
  if (e.key === "ArrowRight" || e.key === "d") player.moveRight = true;
  if (e.key === " ") {
    e.preventDefault();
    player.jump();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") player.moveLeft = false;
  if (e.key === "ArrowRight" || e.key === "d") player.moveRight = false;
});

export function drawUI() {
  if (!input.isMobile) return;

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.arc(150, canvas.height - 150, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width - 150, canvas.height - 150, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}