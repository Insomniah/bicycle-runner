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
│   ├── world.js                   # создаёт window.game.world (управление уровнем, фоном)
│   ├── player.js                  # создаёт window.game.player (данные, движение, анимация, отрисовка)
│   ├── collision.js               # обработка столкновений игрока с платформами
│   ├── camera.js                  # создаёт window.game.camera (камера)
│   ├── controls.js                # клавиатура и тач-зоны
│   ├── core/
│   │   ├── canvas.js              # инициализация canvas, resizeCanvas, rebuildWorld
│   │   └── layers.js              # система слоёв (addToLayer, clearLayer, drawLayers)
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
window.game
Единый объект-контейнер для состояния игры и основных подсистем.

Поля:

state: объект с полями:

gameOver – текущий статус игры (false, "complete", "fail").

nextLevelQueued – флаг, предотвращающий повторный запуск переключения уровня.

restarting – флаг, предотвращающий повторный вызов рестарта.

player – ссылка на объект игрока (см. ниже).

world – ссылка на объект мира (см. ниже).

camera – ссылка на объект камеры (см. ниже).

gameOverUI – ссылка на объект UI окончания игры.

Методы:

restart() – перезапускает текущий уровень, сбрасывает состояние игрока и флаги.

drawDebug() – отображает отладочную информацию на экране.

window.game.player
Поля: x, y, width, height, speed, vy, gravity, jumpPower, onGround, moveLeft, moveRight, autoMove, sprite, анимационные поля.

Методы:

jump() – выполнить прыжок.

draw(ctx, camera) – отрисовка спрайта с учётом направления.

initPosition() – устанавливает начальную позицию игрока на текущем уровне.

update(dt) – обновление движения, гравитации, анимации, коллизий.

Коллизии: делегируются функции handleCollisions(player, level) из collision.js.

window.game.world
Поля: sky, mountains, currentLevel.

Методы:

setLevel(level) – переключает уровень, генерирует платформы, сбрасывает состояние игрока и камеры, перегенерирует фон, автоматически вызывает rocks.generate().

getGroundBase() – возвращает groundY текущего уровня (с защитой от undefined).

update() – обновляет фон (sky, mountains).

draw(ctx, camera) – рисует фон.

window.game.camera
Поля: x, y, initialized.

Метод update():

Горизонтальное следование с отступом 35% от левого края.

Вертикальное плавное следование с ограничением снизу (земля на 75% высоты экрана).

Добавлены проверки на NaN и корректность canvas/player.y.

window.game.gameOverUI
Управляет оверлеем #game-over. Методы show(isComplete), hide(). Кнопка рестарта вызывает window.game.restart(). Присваивается в game.js.

Фоновые объекты (rocks, sky, mountains, skybackground)
Остаются глобальными, так как могут отличаться для разных уровней.

Используют window.game.world.currentLevel для получения данных текущего уровня.

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
Игрок	PLAYER_WIDTH	Ширина коллизии и отрисовки игрока (px)
PLAYER_HEIGHT	Высота коллизии и отрисовки игрока (px)
PLAYER_SPEED	Скорость перемещения (px/сек)
PLAYER_GRAVITY	Сила гравитации (px/сек²)
PLAYER_JUMP_POWER	Начальная вертикальная скорость прыжка (px/сек)
PLAYER_FRAME_WIDTH	Ширина кадра в спрайт-листе (px)
PLAYER_FRAME_HEIGHT	Высота кадра в спрайт-листе (px)
PLAYER_FRAME_COUNT	Количество кадров анимации
PLAYER_FRAME_INTERVAL	Интервал смены кадров (сек)
PLAYER_START_X	Начальная координата игрока по X (px)
Камера	CAMERA_HORIZONTAL_OFFSET	Отступ камеры от игрока по горизонтали (0.35 = 35%)
CAMERA_VERTICAL_SMOOTHING	Плавность следования по вертикали (0.05)
CAMERA_GROUND_TARGET	Положение земли на экране (0.75 = 75% высоты)
Физика	MAX_DT	Максимальный шаг времени (сек), предотвращает проскок коллизий
MIN_FRAME	Минимальный множитель для ограничения дельты времени (0.5)
MAX_FRAME	Максимальный множитель для ограничения дельты времени (2)
FINISH_THRESHOLD	Расстояние до правого края для завершения уровня (px)
AUTO_MOVE_EXTRA	Дополнительное расстояние, которое игрок проезжает после финиша (px)
FALL_LIMIT_OFFSET	Нижняя граница падения (px ниже уровня)
Фон	SKY_CLOUD_WRAP_MARGIN	Запас для зацикливания облаков за краем уровня (px)
SKY_WIND_SPEED	Скорость ветра (движение облаков, px/сек)
SKY_PARALLAX	Коэффициент параллакса облаков (0.2)
MOUNTAINS_BURY_FACTOR	Доля гор, утопленных в землю (0.4)
ROCKS_PER_PLATFORM	Количество камней, генерируемых на одной платформе
ROCKS_MARGIN	Отступ камней от краёв платформы (px)
Управление	TOUCH_MOVE_ZONE_RADIUS	Радиус левой (движение) тач-зоны (px)
TOUCH_JUMP_ZONE_RADIUS	Радиус правой (прыжок) тач-зоны (px)
TOUCH_MOVE_ZONE_X	X-координата центра левой зоны (px)
TOUCH_MOVE_ZONE_Y_OFFSET	Смещение левой зоны от нижнего края (px)
TOUCH_JUMP_ZONE_X_OFFSET	Смещение правой зоны от правого края (px)
TOUCH_JUMP_ZONE_Y_OFFSET	Смещение правой зоны от нижнего края (px)
TOUCH_SWIPE_THRESHOLD	Минимальное смещение пальца для определения движения (px)
Отладка	DEBUG_FONT	Шрифт для отладочной информации
DEBUG_COLOR	Цвет текста отладки
Уровни	LEVEL_SWITCH_DELAY	Задержка перед автоматической сменой уровня после финиша (мс)

Система слоёв
layers.js предоставляет глобальные функции addToLayer(layer, obj), clearLayer(layer), drawLayers(ctx, camera), работающие с внутренним объектом layers.

В rebuildWorld() платформы уровня добавляются в слой world.

Управление
Клавиатура: стрелки / A/D — движение, пробел — прыжок.

Тач-зоны:

Левая зона (круг радиусом 100px) — движение влево/вправо по смещению пальца.

Правая зона (круг радиусом 80px) — прыжок.

Рестарт: через DOM-кнопку #restart-button (обработчик вызывает window.game.restart()).

Данные уровней
level1.js и level2.js содержат объекты с полями number, width, height, groundY, platformData[], platforms[], groundPlatforms[], метод generate().

После вызова generate() создаются объекты Platform и заполняются массивы.

Инициализация игры
В main.js после загрузки страницы:

Вызов loadAllImages() – предзагрузка всех изображений.
После успешной загрузки: установка window.game.world.sky и window.game.world.mountains, вызов window.game.world.setLevel(level1) (внутри которого генерируются платформы, камни и фон), добавление объектов в слои, вызов resizeCanvas() и rebuildWorld(), запуск игрового цикла.
Если загрузка изображений не удалась, ошибка логируется в консоль, игра не стартует.

Игровой цикл (main.js)
requestAnimationFrame(gameLoop), вычисление dt с ограничением CONFIG.MAX_DT.

Обновление: window.game.camera.update(), window.game.player.update(dt), window.game.world.update().

Отрисовка: drawLayers(ctx, window.game.camera), window.game.player.draw(ctx, window.game.camera), drawUI(), window.game.drawDebug().

Обработка game.state.gameOver:

Если game.state.gameOver === "complete" – устанавливается game.player.autoMove = true, через CONFIG.LEVEL_SWITCH_DELAY вызывается window.game.
при gameOver === "complete" ограничение по правому краю не применяется, чтобы игрок мог свободно уехать за пределы уровня.
world.setLevel(level2) (автоматически обновляет камни), rebuildWorld(), сброс флагов.

Если game.state.gameOver === "fail" – показывается оверлей Game Over.

Рестарт и переключение уровней
window.game.restart() проверяет флаг game.state.restarting, перегенерирует текущий уровень, вызывает rocks.generate() (вручную, так как setLevel не вызывается), rebuildWorld(), сбрасывает позицию игрока, autoMove и движение, сбрасывает game.state.gameOver и скрывает оверлей.

При переключении уровня (window.game.world.setLevel) камни генерируются автоматически внутри метода, что исключает дублирование кода.

Управление canvas и миром
В canvas.js определены две ключевые функции:

resizeCanvas() – обновляет размеры canvas и масштаб. Вызывается при изменении размера окна или повороте экрана.

rebuildWorld() – перестраивает платформы из текущего уровня (очищает слой world и добавляет платформы заново). Вызывается при старте, рестарте и смене уровня.

Такое разделение позволяет изменять размер окна без сброса состояния игры (игрок остаётся на месте, прогресс не теряется).

Предзагрузка изображений
Все графические ресурсы загружаются асинхронно до запуска игрового цикла.

Реализована функция loadAllImages(), возвращающая Promise.

После загрузки выставляется rocks.loaded = true, и игра стартует.

Удалённый мёртвый код и рефакторинг
Удалён метод Platform.checkCollision().

Удалены поля world.clouds и метод world.addCloud().

Удалены переменные restartButton и связанные обработчики.

Удалён дублирующий обработчик кнопки рестарта.

Удалена неиспользуемая функция getSceneScale().

Удалены ручные вызовы генерации уровней и фона — теперь всё через world.setLevel.

Удалена функция recalcScene() – заменена на resizeCanvas() и rebuildWorld().

Глобальные переменные world, camera, gameOver заменены на window.game.*.

Глобальные функции initPlayerPosition, updatePlayer, restartLevel, drawDebug перенесены в window.game как методы.

Дублирование вызова rocks.generate() устранено: вызов перенесён внутрь world.setLevel.