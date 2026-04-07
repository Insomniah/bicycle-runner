// core/assetManager.js
export const assetManager = {
  images: new Map(),
  
  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        // Обратная совместимость (без optional chaining в левой части)
        if (key === 'wheel') window.wheelSprite = img;
        if (key === 'player') {
        if (window.game.player) {
          window.game.player.sprite = img;
          } else {
            console.warn('window.game.player not ready yet, storing image for later');
            window._pendingPlayerSprite = img;
          }
        }
        if (key === 'mountains_bg') {
          if (!window.preloadedBackgrounds) window.preloadedBackgrounds = {};
          window.preloadedBackgrounds[CONFIG.BACKGROUND_MOUNTAINS] = img;
        }
        if (key === 'factories_bg') {
          if (!window.preloadedBackgrounds) window.preloadedBackgrounds = {};
          window.preloadedBackgrounds[CONFIG.BACKGROUND_FACTORIES] = img;
        }
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  },
  
  async loadAllAssets() {
    const load = this.loadImage.bind(this);
    
    await load('player', 'assets/player/player.png');
    await load('mountains_bg', CONFIG.BACKGROUND_MOUNTAINS);
    await load('factories_bg', CONFIG.BACKGROUND_FACTORIES);
    
    const rockPromises = decorations.rockTypes.map((type, idx) => 
      load(`rock_${idx}`, type.src)
    );
    const rockImages = await Promise.all(rockPromises);
    decorations.setRockImages(rockImages);
    
    const tirePromises = decorations.tireTypes.map((type, idx) => 
      load(`tire_${idx}`, type.src)
    );
    const tireImages = await Promise.all(tirePromises);
    decorations.setTireImages(tireImages);
    
    await load('wheel', 'assets/objects/wheel.png');
    
    console.log('All assets loaded via AssetManager');
  },
  
  get(key) {
    return this.images.get(key);
  }
};

window.preloadedBackgrounds = window.preloadedBackgrounds || {};