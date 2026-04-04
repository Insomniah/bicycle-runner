// config.js – игровые константы

const CONFIG = {
  // Игрок
  // Исходные размеры видимой части персонажа на спрайте (в пикселях)
  PLAYER_SRC_VISIBLE_X: 2,
  PLAYER_SRC_VISIBLE_Y: 0,
  PLAYER_SRC_VISIBLE_W: 12,
  PLAYER_SRC_VISIBLE_H: 16,
  PLAYER_SCALE: 4,

  // Желаемый размер хитбокса (узкий, под ноги)
  PLAYER_WIDTH: 24,          // было 48, уменьшили до 24
  PLAYER_HEIGHT: 64,         // 16 * 4
  PLAYER_DRAW_WIDTH: 48,     // фактическая ширина отрисовки (может быть больше хитбокса для лучшего вида)

  PLAYER_SPEED: 6,
  PLAYER_GRAVITY: 0.3,
  PLAYER_JUMP_POWER: -9,
  PLAYER_FRAME_WIDTH: 16,
  PLAYER_FRAME_HEIGHT: 16,
  PLAYER_FRAME_COUNT: 17,
  PLAYER_FRAME_INTERVAL: 0.08,
  PLAYER_START_X: 200,

  // Coyote Time (секунд)
  PLAYER_COYOTE_TIME: 0.1,

  // Камера
  CAMERA_HORIZONTAL_OFFSET: 0.35,
  CAMERA_VERTICAL_SMOOTHING: 0.05,
  CAMERA_GROUND_TARGET: 0.75,

  // Физика
  MAX_DT: 0.033,
  FINISH_THRESHOLD: 5,
  AUTO_MOVE_EXTRA: 200,
  FALL_LIMIT_OFFSET: 200,
  MIN_FRAME: 0.5,
  MAX_FRAME: 2,

  // Фон
  SKY_CLOUD_WRAP_MARGIN: 300,
  SKY_WIND_SPEED: 0.2,
  SKY_PARALLAX: 0.2,
  // Цвет неба по умолчанию (если у уровня не указан skyColor)
    DEFAULT_SKY_COLOR: "#000000",
  MOUNTAINS_BURY_FACTOR: 0.4,
  ROCKS_PER_PLATFORM: 4,
  ROCKS_MARGIN: 10,

  // Фоновые изображения (пути)
  BACKGROUND_MOUNTAINS: "assets/mountains/mountains-bg.png",
  BACKGROUND_FACTORIES: "assets/industrial/factories-bg.png",

  // Масштаб отрисовки фонов (1 = оригинальный размер)
  BACKGROUND_SCALE: {
    "assets/mountains/mountains-bg.png": 1,
    "assets/industrial/factories-bg.png": 2   // увеличит заводы в 2.5 раза
    },

  // Колёса
  WHEEL_FRAME_W: 216,              // ширина одного кадра в спрайт-листе (пиксели)
  WHEEL_SPRITE_SRC_Y: 0,           // смещение по Y (вся высота используется)
  WHEEL_SPRITE_SRC_H: 203,         // высота видимой части колеса в спрайт-листе
  WHEEL_FRAME_COUNT: 7,            // количество кадров анимации
  WHEEL_FRAME_INTERVAL: 0.1,       // интервал смены кадров (сек)
  WHEEL_DRAW_SIZE: 32,             // размер отрисовки на экране (пиксели)

  // Управление
  TOUCH_MOVE_ZONE_RADIUS: 100,
  TOUCH_JUMP_ZONE_RADIUS: 80,
  TOUCH_MOVE_ZONE_X: 150,
  TOUCH_MOVE_ZONE_Y_OFFSET: 150,
  TOUCH_JUMP_ZONE_X_OFFSET: 150,
  TOUCH_JUMP_ZONE_Y_OFFSET: 150,
  TOUCH_SWIPE_THRESHOLD: 20,

  // Отладка
  DEBUG_FONT: "14px monospace",
  DEBUG_COLOR: "white",

  // Уровни
  LEVEL_SWITCH_DELAY: 2000,
};

// Вычисляемые поля (после объявления основного объекта)
CONFIG.PLAYER_HITBOX_OFFSET_X = (CONFIG.PLAYER_WIDTH - CONFIG.PLAYER_SRC_VISIBLE_W) / 2;

window.CONFIG = CONFIG;