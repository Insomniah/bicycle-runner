PROJECT.md — Bicycle Runner (актуальная версия)
Движок и язык
Чистый JavaScript (ES6) + HTML5 Canvas

Без фреймворков

Адаптация под мобильные устройства (тач-зоны, ориентация, viewport)

Предзагрузка ресурсов: все изображения загружаются до старта игрового цикла (Promise + async/await)

Ограничение dt: максимальное значение 0.033 сек для стабильности физики и предотвращения проскока коллизий

Централизованная конфигурация: все игровые параметры вынесены в js/config.js (размеры игрока, физика, камера, тач-зоны, задержки и т.д.)

Описание игры
2D платформер-раннер. Игрок управляет велосипедистом, перемещается по уровню, прыгает по платформам и земле. Цель — добраться до правого края уровня. При касании правой границы уровень считается пройденным, игрок автоматически движется вправо (autoMove = true), и через 2 секунды загружается следующий уровень (level1 → level2). При падении вниз (за пределы уровня) — Game Over с возможностью рестарта.

Структура проекта (актуальная)
text
bicycle-runner/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js                  # все игровые константы
│   ├── main.js                    # игровой цикл, предзагрузка, инициализация, рестарт, debug
│   ├── game.js                    # canvas, gameOverUI, адаптация
│   ├── world.js                   # глобальный объект world (управление уровнем, фоном)
│   ├── player.js                  # данные и методы игрока (window.game.player)
│   ├── collision.js               # обработка столкновений игрока с платформами
│   ├── camera.js                  # камера
│   ├── controls.js                # клавиатура и тач-зоны
│   ├── core/
│   │   ├── canvas.js              # инициализация canvas, resize, recalcScene
│   │   └── layers.js              # система слоёв
│   ├── entities/
│   │   └── platform.js            # класс Platform (конструктор, draw, флаг passableFromBelow)
│   ├── background/
│   │   ├── skybackground.js       # заливка неба
│   │   ├── sky.js                 # облака с ветром, параллакс, зацикливание
│   │   ├── mountains.js           # горы (тайлинг)
│   │   └── rocks.js               # камни на земле
│   └── utils/
│       └── math.js
├── levels/
│   ├── level1.js
│   └── level2.js
└── assets/
    ├── player/
    │   └── player.png
    ├── mountains/
    │   └── mountains-bg.png
    └── rocks/
        └── *.png
Ключевые глобальные объекты
window.game.player
Поля: x, y, width, height, speed, vy, gravity, jumpPower, onGround, moveLeft, moveRight, autoMove, sprite, анимационные поля.

Методы: jump(), draw(ctx, camera) – отрисовка спрайта с учётом направления.

Анимация: обновляется в updatePlayer, кадры переключаются по таймеру.

Коллизии: делегируются функции handleCollisions(player, level) из collision.js.

window.world
Поля: sky, mountains, currentLevel.

Методы:

setLevel(level) – переключает уровень, генерирует платформы, сбрасывает состояние игрока и камеры, перегенерирует фон.

getGroundBase() – возвращает groundY текущего уровня (с защитой от undefined).

update() – обновляет фон (sky, mountains).

draw(ctx, camera) – рисует фон.

window.camera
Горизонтальное следование с отступом 35% от левого края.

Вертикальное плавное следование с ограничением снизу (земля на 75% высоты экрана).

Добавлены проверки на NaN и корректность canvas/player.y.

window.gameOverUI
Управляет оверлеем #game-over. Методы show(isComplete), hide(). Кнопка рестарта вешает обработчик один раз (в init()).

window.rocks
Асинхронная загрузка изображений, генерация камней на groundPlatforms уровня (по 4 камня на платформу). Вызывается при старте и при смене уровня.

sky и mountains
sky: генерация облаков по ширине уровня, движение с ветром, параллакс 0.2. Зацикливание через условие if (cloud.x < -cloud.w) cloud.x = level.width + 300; else if (cloud.x > level.width + 300) cloud.x = -cloud.w;.

mountains: тайлинг по горизонтали, привязка к земле, утапливание на 40%.

Platform (класс)
Конструктор (x, y, width, height, passableFromBelow = true).

draw(ctx, camera) – рисует коричневый прямоугольник.

Флаг passableFromBelow: если true (по умолчанию), игрок может проходить сквозь платформу снизу (не сталкивается головой). Если false, платформа блокирует движение снизу.

collision.js (модуль)
Функция handleCollisions(player, level):

Использует player.prevY для корректных вертикальных проверок.

Обрабатывает приземление (если vy >= 0) и столкновение головой (если vy < 0 и платформа не проходима снизу).

После вертикальной коррекции выполняет горизонтальное разрешение.

Возвращает { onGround }.

Конфигурация (CONFIG)
Все настройки игры хранятся в js/config.js и доступны через window.CONFIG. Основные параметры:

Категория	Параметр	Описание
Игрок	PLAYER_WIDTH, PLAYER_HEIGHT	Размеры коллизии и отрисовки (пиксели)
PLAYER_SPEED	Скорость перемещения
PLAYER_GRAVITY	Сила гравитации
PLAYER_JUMP_POWER	Начальная скорость прыжка
PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT	Размеры кадра в спрайте
PLAYER_FRAME_COUNT	Количество кадров анимации
PLAYER_FRAME_INTERVAL	Интервал смены кадров (сек)
Камера	CAMERA_HORIZONTAL_OFFSET	Отступ камеры от игрока по горизонтали (0.35 = 35%)
CAMERA_VERTICAL_SMOOTHING	Плавность следования по вертикали (0.05)
CAMERA_GROUND_TARGET	Положение земли на экране (0.75 = 75% высоты)
Физика	MAX_DT	Максимальный шаг времени (0.033 сек)
FINISH_THRESHOLD	Расстояние до правого края для завершения уровня (5 px)
AUTO_MOVE_EXTRA	Дополнительное расстояние после финиша (200 px)
FALL_LIMIT_OFFSET	Нижняя граница падения (200 px ниже уровня)
Управление	TOUCH_MOVE_ZONE_RADIUS, TOUCH_JUMP_ZONE_RADIUS	Радиусы тач-зон
TOUCH_MOVE_ZONE_X, TOUCH_MOVE_ZONE_Y_OFFSET	Позиция левой зоны
TOUCH_JUMP_ZONE_X_OFFSET, TOUCH_JUMP_ZONE_Y_OFFSET	Позиция правой зоны
TOUCH_SWIPE_THRESHOLD	Минимальное смещение для определения движения
Отладка	DEBUG_FONT, DEBUG_COLOR	Стиль текста отладки
Уровни	LEVEL_SWITCH_DELAY	Задержка перед сменой уровня (2000 мс)
Для изменения размера игрока достаточно изменить PLAYER_WIDTH и PLAYER_HEIGHT в config.js. Остальные параметры подстроятся автоматически.

Система слоёв
layers.js предоставляет глобальный layers с массивами: background, midground, world, actors, foreground, ui.

Функции: addToLayer(layer, obj), clearLayer(layer), drawLayers(ctx, camera).

В recalcScene() платформы уровня добавляются в слой world.

Управление
Клавиатура: стрелки / A/D — движение, пробел — прыжок.

Тач-зоны:

Левая зона (круг радиусом 100px) — движение влево/вправо по смещению пальца.

Правая зона (круг радиусом 80px) — прыжок.

Рестарт: через DOM-кнопку #restart-button (обработчик в gameOverUI.init()).

Данные уровней
level1.js и level2.js содержат объекты с полями number, width, height, groundY, platformData[], platforms[], groundPlatforms[], метод generate().

После вызова generate() создаются объекты Platform и заполняются массивы.

Инициализация игры
В main.js после загрузки страницы:

Вызов loadAllImages() – предзагрузка всех изображений.
После успешной загрузки: регистрация world.sky и world.mountains, вызов world.setLevel(level1), rocks.generate(), добавление объектов в слои, recalcScene(), запуск игрового цикла.
Если загрузка изображений не удалась, ошибка логируется в консоль, игра не стартует.

Игровой цикл (main.js)
requestAnimationFrame(gameLoop), вычисление dt с ограничением CONFIG.MAX_DT.

Обновление: camera.update(), updatePlayer(dt), world.update().

Отрисовка: drawLayers(ctx, camera), game.player.draw(ctx, camera), drawUI(), drawDebug().

Обработка gameOver:

Если gameOver === "complete" – устанавливается game.player.autoMove = true, через CONFIG.LEVEL_SWITCH_DELAY вызывается world.setLevel(level2), rocks.generate(), recalcScene(), сброс флагов.

Если gameOver === "fail" – показывается оверлей Game Over.

Рестарт и переключение уровней
restartLevel() проверяет флаг restarting (предотвращает повторный вызов), перегенерирует текущий уровень, камни, сбрасывает камеру, позицию игрока, autoMove и движение.

При переключении уровня (world.setLevel) также вызывается rocks.generate() для обновления камней.

В таймауте переключения уровня установлен флаг nextLevelQueued, предотвращающий повторный запуск.

Предзагрузка изображений
Все графические ресурсы загружаются асинхронно до запуска игрового цикла.

Реализована функция loadAllImages(), возвращающая Promise.

После загрузки выставляется rocks.loaded = true, и игра стартует.

Удалённый мёртвый код (важно для нейросети)
Удалён метод Platform.checkCollision().

Удалены поля world.clouds и метод world.addCloud().

Удалены переменные restartButton в main.js и controls.js, а также связанные обработчики на canvas.

Удалён дублирующий обработчик кнопки рестарта в game.js.

Удалена неиспользуемая функция getSceneScale() в canvas.js.

Удалены ручные вызовы level1.generate(), level2.generate(), sky.generate(), mountains.generate() при старте — теперь всё через world.setLevel.

Удалена старая функция drawPlayer из player.js (теперь отрисовка внутри game.player.draw).