// config.js – игровые константы

const CONFIG = {
    // Игрок
    // Исходные размеры видимой части персонажа на спрайте (в пикселях)
    PLAYER_SRC_VISIBLE_X: 4,
    PLAYER_SRC_VISIBLE_Y: 0,
    PLAYER_SRC_VISIBLE_W: 8,
    PLAYER_SRC_VISIBLE_H: 16,
    PLAYER_SCALE: 4, // масштаб для увеличения видимой части спрайта до нужного размера в игре

    // Вычисляемые итоговые размеры
    PLAYER_WIDTH: 0,
    PLAYER_HEIGHT: 0,
    PLAYER_SPRITE_OFFSET_X: 0,      // Смещение спрайта игрока по X относительно его позиции (можно вычислять из видимой части)
    PLAYER_SPRITE_OFFSET_Y: 0,     // Аналогично, лучше вычислять

    PLAYER_SPEED: 6,
    PLAYER_GRAVITY: 0.3,
    PLAYER_JUMP_POWER: -9,
    PLAYER_FRAME_WIDTH: 16,
    PLAYER_FRAME_HEIGHT: 16,
    PLAYER_FRAME_COUNT: 17,
    PLAYER_FRAME_INTERVAL: 0.08,
    PLAYER_START_X: 200,     // начальная позиция игрока по X

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

// вычисляемые поля
CONFIG.PLAYER_WIDTH = CONFIG.PLAYER_SRC_VISIBLE_W * CONFIG.PLAYER_SCALE,    // ширина игрока в игре, можно закомментировать и указать явно в CONFIG
CONFIG.PLAYER_HEIGHT = CONFIG.PLAYER_SRC_VISIBLE_H * CONFIG.PLAYER_SCALE;   // аналогично для высоты

window.CONFIG = CONFIG; // делаем глобальной константой для удобства доступа из других модулей