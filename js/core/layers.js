const layers = {

    background: [],
    midground: [],
    world: [],
    actors: [],
    foreground: [],
    ui: []

};

function addToLayer(layer, obj) {

    layers[layer].push(obj);

}

function clearLayer(layer) {

    if (layers[layer]) {
        layers[layer].length = 0;
    }

}

function drawLayers(ctx, camera) {

    const order = [
        "background",
        "midground",
        "world",
        "actors",
        "foreground",
        "ui"
    ];

    for (const layerName of order) {

        for (const obj of layers[layerName]) {

            if (obj.draw) {
                obj.draw(ctx, camera);
            }

        }

    }

}