// core/stateMachine.js
import { eventBus } from './eventBus.js';

// Состояния игры
export const GameState = {
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over',
  SWITCHING_LEVEL: 'switching_level'
};

// Допустимые переходы
const transitions = {
  [GameState.PLAYING]: {
    complete: GameState.LEVEL_COMPLETE,
    fail: GameState.GAME_OVER
  },
  [GameState.LEVEL_COMPLETE]: {
    switch: GameState.SWITCHING_LEVEL
  },
  [GameState.SWITCHING_LEVEL]: {
    start: GameState.PLAYING
  },
  [GameState.GAME_OVER]: {
    restart: GameState.PLAYING
  }
};

class StateMachine {
  constructor(initialState = GameState.PLAYING) {
    this.state = initialState;
    this.listeners = [];
  }

  // Переход в новое состояние
  transition(action) {
    const nextState = transitions[this.state]?.[action];
    if (!nextState) {
      console.warn(`Invalid transition: ${this.state} -> ${action}`);
      return false;
    }
    const prevState = this.state;
    this.state = nextState;
    this.emit(prevState, nextState, action);
    return true;
  }

  // Подписка на изменения состояния
  onTransition(callback) {
    this.listeners.push(callback);
  }

  emit(prevState, newState, action) {
    for (const cb of this.listeners) {
      cb(prevState, newState, action);
    }
    // Также отправляем события в Event Bus для слабой связанности
    eventBus.emit('state.change', { prevState, newState, action });
    eventBus.emit(`state.${newState}`, { prevState, action });
  }

  // Сброс в начальное состояние (для рестарта)
  reset() {
    this.state = GameState.PLAYING;
    this.emit(GameState.GAME_OVER, GameState.PLAYING, 'restart');
  }
}

export const gameState = new StateMachine(GameState.PLAYING);