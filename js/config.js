// config.js – игровые константы

const CONFIG = {
    // Игрок
    PLAYER_WIDTH: 48,
    PLAYER_HEIGHT: 48,
    PLAYER_SPEED: 6,
    PLAYER_GRAVITY: 0.3,
    PLAYER_JUMP_POWER: -9,
    PLAYER_FRAME_WIDTH: 16,
    PLAYER_FRAME_HEIGHT: 16,
    PLAYER_FRAME_COUNT: 17,
    PLAYER_FRAME_INTERVAL: 0.08,
    PLAYER_START_X: 200,           // начальная позиция игрока по X

    // Камера
    CAMERA_HORIZONTAL_OFFSET: 0.35,
    CAMERA_VERTICAL_SMOOTHING: 0.05,
    CAMERA_GROUND_TARGET: 0.75,

    // Физика
    MAX_DT: 0.033,
    FINISH_THRESHOLD: 5,
    AUTO_MOVE_EXTRA: 200,
    FALL_LIMIT_OFFSET: 200,
    MIN_FRAME: 0.5,                // минимальный множитель кадра
    MAX_FRAME: 2,                  // максимальный множитель кадра

    // Фон
    SKY_CLOUD_WRAP_MARGIN: 300,
    SKY_WIND_SPEED: 0.2,
    SKY_PARALLAX: 0.2,
    MOUNTAINS_BURY_FACTOR: 0.4,
    ROCKS_PER_PLATFORM: 4,
    ROCKS_MARGIN: 10,

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

window.CONFIG = CONFIG;