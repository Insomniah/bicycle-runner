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

    // Мир
    GROUND_Y_OFFSET: 0, // используется только для groundY в уровнях, но уровни сами задают groundY

    // Камера
    CAMERA_HORIZONTAL_OFFSET: 0.35, // процент от ширины canvas
    CAMERA_VERTICAL_SMOOTHING: 0.05,
    CAMERA_GROUND_TARGET: 0.75, // 75% высоты экрана для земли

    // Физика
    MAX_DT: 0.033,
    FINISH_THRESHOLD: 5, // пикселей до правого края для финиша
    AUTO_MOVE_EXTRA: 200, // дополнительное расстояние после финиша
    FALL_LIMIT_OFFSET: 200, // на сколько ниже уровня считать падение

    // Управление (тач)
    TOUCH_MOVE_ZONE_RADIUS: 100,
    TOUCH_JUMP_ZONE_RADIUS: 80,
    TOUCH_MOVE_ZONE_X: 150,
    TOUCH_MOVE_ZONE_Y_OFFSET: 150, // от нижнего края
    TOUCH_JUMP_ZONE_X_OFFSET: 150, // от правого края
    TOUCH_JUMP_ZONE_Y_OFFSET: 150,
    TOUCH_SWIPE_THRESHOLD: 20,

    // Отладка
    DEBUG_FONT: "14px monospace",
    DEBUG_COLOR: "white",

    // Уровни
    LEVEL_SWITCH_DELAY: 2000, // мс
};

// Для удобства можно вынести в window
window.CONFIG = CONFIG;