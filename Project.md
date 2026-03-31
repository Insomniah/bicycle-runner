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
│   ├── config.js                  # все игровые константы (размеры, физика, фон, управление)
│   ├── main.js                    # игровой цикл, предзагрузка, инициализация, рестарт, debug
│   ├── game.js                    # canvas, gameOverUI, адаптация
│   ├── world.js                   # создаёт window.game.world (управление уровнем, фоном)
│   ├── player.js                  # создаёт window.game.player (данные, движение, анимация, отрисовка)
│   ├── collision.js               # обработка столкновений игрока с платформами
│   ├── camera.js                  # создаёт window.game.camera (камера)
│   ├── controls.js                # клавиатура и тач-зоны
│   ├── core/
│   │   ├── canvas.js              # инициализация canvas, resizeCanvas, rebuildWorld
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
    │   └── player.png             # спрайт игрока (16x16, 17 кадров)
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
Поля:

x, y, width, height – координаты и размеры хитбокса (вычисляются из CONFIG.PLAYER_WIDTH/HEIGHT).

speed, vy, gravity, jumpPower – параметры движения.

onGround, moveLeft, moveRight, autoMove – состояние.

sprite – изображение игрока.

Анимационные поля (frameX, frameTimer, frameInterval и т.д.).

Методы:

jump() – прыжок, если игрок на земле и игра не завершена.

draw(ctx, camera) – отрисовка спрайта с учётом видимой области (PLAYER_SRC_VISIBLE_*) и масштабирования до PLAYER_WIDTH/HEIGHT. При движении влево спрайт отражается.

initPosition() – устанавливает начальную позицию на земле текущего уровня.

update(dt) – обновляет физику, коллизии, анимацию.

window.game.world
Поля: sky, mountains, currentLevel.

Методы:

setLevel(level) – переключает уровень, генерирует платформы, сбрасывает состояние игрока и камеры, перегенерирует фон, а также вызывает rocks.generate().

getGroundBase() – возвращает groundY текущего уровня (с защитой от undefined).

update() – обновляет фон (sky, mountains).

draw(ctx, camera) – рисует фон.

window.game.camera
Поля: x, y, initialized.

Метод update():

Горизонтальное следование с отступом CAMERA_HORIZONTAL_OFFSET.

Вертикальное плавное следование с ограничением снизу (земля на CAMERA_GROUND_TARGET высоты экрана).

Проверки на NaN и корректность canvas/player.y.

window.game.gameOverUI
Управляет оверлеем #game-over. Методы show(isComplete), hide(). Кнопка рестарта вызывает window.game.restart().

Фоновые объекты
sky, mountains, rocks, skybackground – остаются глобальными, но используют window.game.world.currentLevel для получения данных уровня. Их параметры (скорость ветра, параллакс, количество камней) вынесены в CONFIG.

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
Все настройки игры хранятся в js/config.js и доступны через window.CONFIG. Основные параметры (выделены последние изменения):

Категория	Параметр	Описание
Игрок	PLAYER_SRC_VISIBLE_X/Y/W/H	Область спрайта, которая визуально отображается (в пикселях исходного кадра)
PLAYER_SCALE	Масштаб видимой области до итогового размера хитбокса
PLAYER_WIDTH, PLAYER_HEIGHT	Вычисляются как src_w * scale и src_h * scale
PLAYER_SPEED, PLAYER_GRAVITY, PLAYER_JUMP_POWER	Движение и прыжок
PLAYER_FRAME_WIDTH/HEIGHT, PLAYER_FRAME_COUNT, PLAYER_FRAME_INTERVAL	Анимация
PLAYER_START_X	Начальная позиция игрока по X
Камера	CAMERA_HORIZONTAL_OFFSET, CAMERA_VERTICAL_SMOOTHING, CAMERA_GROUND_TARGET	Параметры камеры
Физика	MAX_DT, MIN_FRAME, MAX_FRAME, FINISH_THRESHOLD, AUTO_MOVE_EXTRA, FALL_LIMIT_OFFSET	Ограничения шага, условия финиша и падения
Фон	SKY_CLOUD_WRAP_MARGIN, SKY_WIND_SPEED, SKY_PARALLAX	Облака
MOUNTAINS_BURY_FACTOR	Позиционирование гор
ROCKS_PER_PLATFORM, ROCKS_MARGIN	Генерация камней
Управление	TOUCH_MOVE_ZONE_*, TOUCH_JUMP_ZONE_*, TOUCH_SWIPE_THRESHOLD	Размеры и положение тач-зон
Отладка	DEBUG_FONT, DEBUG_COLOR	Стиль отладочного текста
Уровни	LEVEL_SWITCH_DELAY	Задержка перед переключением уровня (мс)
Система слоёв
layers.js предоставляет глобальный layers с массивами: background, midground, world, actors, foreground, ui.

Функции: addToLayer(layer, obj), clearLayer(layer), drawLayers(ctx, camera).

В rebuildWorld() платформы уровня добавляются в слой world.

Управление
Клавиатура: стрелки / A/D — движение, пробел — прыжок.

Тач-зоны:

Левая зона (круг) – движение влево/вправо по смещению пальца.

Правая зона (круг) – прыжок.

Рестарт: через DOM-кнопку #restart-button (обработчик вызывает window.game.restart()).

Данные уровней
level1.js и level2.js содержат объекты с полями number, width, height, groundY, platformData[], platforms[], groundPlatforms[], метод generate().

После вызова generate() создаются объекты Platform и заполняются массивы.

Инициализация игры
В main.js после загрузки страницы:

Вызов loadAllImages() – предзагрузка всех изображений.
После успешной загрузки: привязка window.game.world.sky и window.game.world.mountains, вызов window.game.world.setLevel(level1), добавление объектов в слои, вызов resizeCanvas() и rebuildWorld(), запуск игрового цикла.
Если загрузка изображений не удалась, ошибка логируется в консоль, игра не стартует.

Игровой цикл (main.js)
requestAnimationFrame(gameLoop), вычисление dt с ограничением CONFIG.MAX_DT.

Обновление: window.game.camera.update(), window.game.player.update(dt), window.game.world.update().

Отрисовка: drawLayers(ctx, window.game.camera), window.game.player.draw(ctx, window.game.camera), drawUI(), window.game.drawDebug().

Обработка game.state.gameOver:

Если game.state.gameOver === "complete" – устанавливается game.player.autoMove = true, через CONFIG.LEVEL_SWITCH_DELAY вызывается window.game.world.setLevel(level2), rebuildWorld(), сброс флагов.

Если game.state.gameOver === "fail" – показывается оверлей Game Over.

Рестарт и переключение уровней
window.game.restart() проверяет флаг game.state.restarting, перегенерирует текущий уровень, камни, вызывает rebuildWorld(), сбрасывает позицию игрока, autoMove и движение, сбрасывает game.state.gameOver и скрывает оверлей.

При переключении уровня (window.game.world.setLevel) также вызывается rocks.generate() для обновления камней.

В таймауте переключения уровня установлен флаг game.state.nextLevelQueued, предотвращающий повторный запуск.

Управление canvas и миром
В canvas.js определены:

resizeCanvas() – обновляет размеры canvas и масштаб. Вызывается при изменении размера окна или повороте экрана.

rebuildWorld() – перестраивает платформы из текущего уровня (очищает слой world и добавляет платформы заново). Вызывается при старте, рестарте и смене уровня.

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

Удалены ручные вызовы level1.generate(), level2.generate(), sky.generate(), mountains.generate() при старте — теперь всё через window.game.world.setLevel.

Удалена старая функция drawPlayer из player.js (теперь отрисовка внутри window.game.player.draw).

Удалена функция recalcScene() – заменена на resizeCanvas() и rebuildWorld().

Глобальная переменная world заменена на window.game.world; глобальная camera заменена на window.game.camera.

Глобальные функции initPlayerPosition, updatePlayer, restartLevel, drawDebug перенесены в window.game как методы.

Убраны дублирующие вызовы rocks.generate() из main.js и таймаута переключения уровня. Теперь камни генерируются автоматически внутри window.game.world.setLevel.