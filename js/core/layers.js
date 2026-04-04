// core/layers.js – система слоёв (модуль)
export const layers = {
  background: [],
  midground: [],
  world: [],
  actors: [],
  foreground: [],
  ui: []
};

export function addToLayer(layer, obj) {
  if (layers[layer]) {
    layers[layer].push(obj);
  }
}

export function clearLayer(layer) {
  if (layers[layer]) {
    layers[layer].length = 0;
  }
}

export function drawLayers(ctx, camera) {
  const order = ["background", "midground", "world", "actors", "foreground", "ui"];
  for (const layerName of order) {
    for (const obj of layers[layerName]) {
      if (obj.draw) {
        obj.draw(ctx, camera);
      }
    }
  }
}

// Для обратной совместимости (старый код может использовать глобальные)
window.layers = layers;
window.addToLayer = addToLayer;
window.clearLayer = clearLayer;
window.drawLayers = drawLayers;