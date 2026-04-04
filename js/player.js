// player.js – модуль игрока (рефакторинг: чистая функция физики)
import { handleCollisions } from './collision.js';
import { eventBus } from './core/eventBus.js';

// Чистая функция: вычисляет новое состояние игрока на основе текущего состояния, ввода, уровня и dt
// Возвращает новый объект состояния и дополнительные флаги (gameOverTrigger, levelCompleteTrigger, wheelCollectedCount)
export function updatePlayerPhysics(state, input, level, dt) {
  // Копируем состояние, чтобы не мутировать оригинал
  let { x, y, vy, onGround, autoMove, moveLeft, moveRight, prevY, coyoteTimer, wasOnGround, frameX, frameTimer } = state;
  let wheelsCollectedDelta = 0;
  let levelCompleteTrigger = false;
  let gameOverTrigger = false;

  // Предыдущая позиция для коллизий
  const newPrevY = y;

  // Сбор колёс (проверка на мутацию уровня, но уровень не копируем – позже можно вынести)
  if (level.wheels) {
    for (let i = 0; i < level.wheels.length; i++) {
      const wheel = level.wheels[i];
      // Используем текущие координаты игрока для проверки
      if (wheel.collect({ x, y, width: state.width, height: state.height })) {
        wheelsCollectedDelta++;
        level.wheels.splice(i, 1);
        i--;
      }
    }
  }

  // Проверка завершения уровня
  if (x + state.width >= level.width - CONFIG.FINISH_THRESHOLD && !window.game.state.gameOver) {
    levelCompleteTrigger = true;
    autoMove = true;
  }

  // Горизонтальное движение
  const frame = Math.max(CONFIG.MIN_FRAME, Math.min(dt * 60, CONFIG.MAX_FRAME));
  if (!window.game.state.gameOver) {
    if (moveLeft) x -= state.speed * frame;
    if (moveRight) x += state.speed * frame;
  } else if (levelCompleteTrigger && autoMove) {
    const maxX = level.width + CONFIG.AUTO_MOVE_EXTRA;
    if (x < maxX) x += state.speed * frame;
    else autoMove = false;
    moveLeft = false;
    moveRight = false;
  }

  // Гравитация и вертикальное движение
  vy += state.gravity * frame;
  y += vy * frame;

  // Создаём временный объект игрока для коллизий (не мутируем оригинал)
  const tempPlayer = {
    x, y, vy, width: state.width, height: state.height, prevY: newPrevY
  };
  const { onGround: newOnGround } = handleCollisions(tempPlayer, level);
  // Применяем изменения, возвращённые коллизиями (tempPlayer изменён)
  x = tempPlayer.x;
  y = tempPlayer.y;
  vy = tempPlayer.vy;

  // Coyote Time
  let newCoyoteTimer = coyoteTimer;
  let newWasOnGround = wasOnGround;
  if (newOnGround) {
    newCoyoteTimer = CONFIG.PLAYER_COYOTE_TIME;
    newWasOnGround = true;
  } else {
    if (newWasOnGround && newCoyoteTimer > 0) newCoyoteTimer -= dt;
    else newWasOnGround = false;
  }

  // Ограничения по горизонтали
  if (x < 0) x = 0;
  if (!autoMove && x + state.width > level.width && !levelCompleteTrigger) {
    x = level.width - state.width;
  }

  // Падение за пределы уровня
  const bottomLimit = level.height + CONFIG.FALL_LIMIT_OFFSET;
  if (y > bottomLimit) {
    y = bottomLimit;
    vy = 0;
    if (!window.game.state.gameOver) {
      gameOverTrigger = true;
    }
    moveLeft = false;
    moveRight = false;
  }

  // Анимация
  let newFrameX = frameX;
  let newFrameTimer = frameTimer + dt;
  if (newFrameTimer > state.frameInterval) {
    newFrameTimer = 0;
    newFrameX = (frameX + 1) % state.frameCount;
  }

  // Возвращаем новое состояние и флаги
  return {
    newState: {
      x, y, vy, onGround: newOnGround, autoMove, moveLeft, moveRight,
      prevY: newPrevY, coyoteTimer: newCoyoteTimer, wasOnGround: newWasOnGround,
      frameX: newFrameX, frameTimer: newFrameTimer
    },
    wheelsCollectedDelta,
    levelCompleteTrigger,
    gameOverTrigger
  };
}

// Объект игрока (мутабельный, но обновляется через чистую функцию)
export const player = {
  x: CONFIG.PLAYER_START_X,
  y: 0,
  width: CONFIG.PLAYER_WIDTH,
  height: CONFIG.PLAYER_HEIGHT,
  speed: CONFIG.PLAYER_SPEED,
  vy: 0,
  gravity: CONFIG.PLAYER_GRAVITY,
  jumpPower: CONFIG.PLAYER_JUMP_POWER,
  onGround: false,
  moveLeft: false,
  moveRight: false,
  autoMove: false,
  prevY: 0,
  sprite: null,
  frameX: 0,
  frameY: 0,
  frameWidth: CONFIG.PLAYER_FRAME_WIDTH,
  frameHeight: CONFIG.PLAYER_FRAME_HEIGHT,
  frameCount: CONFIG.PLAYER_FRAME_COUNT,
  frameTimer: 0,
  frameInterval: CONFIG.PLAYER_FRAME_INTERVAL,
  hitboxOffsetX: CONFIG.PLAYER_HITBOX_OFFSET_X,
  coyoteTimer: 0,
  wasOnGround: false,

  jump() {
    const canJump = (this.onGround || this.coyoteTimer > 0) && window.game.state.gameOver === false;
    if (canJump) {
      this.vy = this.jumpPower;
      this.onGround = false;
      this.coyoteTimer = 0;
      this.wasOnGround = false;
    }
  },

  draw(ctx, camera) {
    if (!this.sprite || !this.sprite.complete) return;
    ctx.save();
    const drawW = CONFIG.PLAYER_DRAW_WIDTH;
    const drawH = CONFIG.PLAYER_HEIGHT;
    const visualOffsetX = (drawW - CONFIG.PLAYER_WIDTH) / 2;
    const drawX = this.x - camera.x - visualOffsetX;
    const drawY = this.y - camera.y;
    const srcX = this.frameX * CONFIG.PLAYER_FRAME_WIDTH + CONFIG.PLAYER_SRC_VISIBLE_X;
    const srcY = CONFIG.PLAYER_SRC_VISIBLE_Y;
    const srcW = CONFIG.PLAYER_SRC_VISIBLE_W;
    const srcH = CONFIG.PLAYER_SRC_VISIBLE_H;
    if (this.moveLeft) {
      ctx.translate(drawX + drawW, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(this.sprite, srcX, srcY, srcW, srcH, 0, 0, drawW, drawH);
    } else {
      ctx.drawImage(this.sprite, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drawH);
    }
    ctx.restore();
  },

  initPosition() {
    const level = window.game.world.currentLevel;
    if (!level) return;
    this.y = level.getGroundBase() - this.height;
    this.x = CONFIG.PLAYER_START_X;
    this.vy = 0;
    this.onGround = false;
    this.autoMove = false;
    this.coyoteTimer = 0;
    this.wasOnGround = false;
    console.log("Player initialized at", { x: this.x, y: this.y });
  },

  update(dt) {
    const level = window.game.world.currentLevel;
    if (!level) return;

    // Подготовка входных данных для чистой функции
    const input = {
      moveLeft: this.moveLeft,
      moveRight: this.moveRight,
      autoMove: this.autoMove
    };
    const state = {
      x: this.x, y: this.y, vy: this.vy, onGround: this.onGround,
      autoMove: this.autoMove, moveLeft: this.moveLeft, moveRight: this.moveRight,
      prevY: this.prevY, coyoteTimer: this.coyoteTimer, wasOnGround: this.wasOnGround,
      frameX: this.frameX, frameTimer: this.frameTimer,
      width: this.width, height: this.height, speed: this.speed, gravity: this.gravity,
      frameCount: this.frameCount, frameInterval: this.frameInterval
    };

    const { newState, wheelsCollectedDelta, levelCompleteTrigger, gameOverTrigger } =
      updatePlayerPhysics(state, input, level, dt);

    // Применяем новое состояние
    this.x = newState.x;
    this.y = newState.y;
    this.vy = newState.vy;
    this.onGround = newState.onGround;
    this.autoMove = newState.autoMove;
    this.moveLeft = newState.moveLeft;
    this.moveRight = newState.moveRight;
    this.prevY = newState.prevY;
    this.coyoteTimer = newState.coyoteTimer;
    this.wasOnGround = newState.wasOnGround;
    this.frameX = newState.frameX;
    this.frameTimer = newState.frameTimer;

    // Обработка событий
    if (wheelsCollectedDelta > 0) {
      window.game.state.wheelsCollected += wheelsCollectedDelta;
      eventBus.emit('wheel.collected', { count: window.game.state.wheelsCollected });
    }
    if (levelCompleteTrigger && !window.game.state.gameOver) {
      window.game.state.gameOver = "complete";
      this.autoMove = true;
      console.log("Level finished! gameOver set to 'complete'");
      eventBus.emit('level.complete');
    }
    if (gameOverTrigger && !window.game.state.gameOver) {
      window.game.state.gameOver = "fail";
      console.log("Player fell off level, gameOver = fail");
      eventBus.emit('game.over', { reason: 'fall' });
    }
  }
};