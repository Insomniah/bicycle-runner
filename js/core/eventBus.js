// core/eventBus.js
export const eventBus = {
  events: new Map(),

  on(event, callback) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(callback);
  },

  off(event, callback) {
    if (!this.events.has(event)) return;
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    if (index !== -1) callbacks.splice(index, 1);
  },

  emit(event, data) {
    if (!this.events.has(event)) return;
    for (const callback of this.events.get(event)) {
      callback(data);
    }
  }
};

// Для глобального доступа (совместимость)
window.game = window.game || {};
window.game.eventBus = eventBus;