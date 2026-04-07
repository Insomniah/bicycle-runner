// core/gameStore.js
import { eventBus } from './eventBus.js';

const store = {
  _wheelsCollected: 0,
  _debugMode: false,
  // _lives: 3,   // можно добавить позже
};

export const gameStore = {
  // ===== Колёса =====
  get wheelsCollected() {
    return store._wheelsCollected;
  },
  set wheelsCollected(value) {
    if (value < 0) value = 0;
    store._wheelsCollected = value;
    eventBus.emit('wheelsCollected.change', value);
  },
  incrementWheels() {
    this.wheelsCollected++;
  },
  resetWheels() {
    this.wheelsCollected = 0;
  },

  // ===== Debug Mode =====
  get debugMode() {
    return store._debugMode;
  },
  set debugMode(value) {
    store._debugMode = value;
    eventBus.emit('debugMode.change', value);
  },
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
  },

  // ===== Жизни (пример) =====
  // get lives() { return store._lives; },
  // set lives(value) { ... }
};