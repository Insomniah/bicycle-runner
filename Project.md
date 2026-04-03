Движок и язык
Чистый JavaScript (ES6) + HTML5 Canvas. Без фреймворков.

Адаптация под мобильные устройства (тач-зоны, ориентация, viewport).
Предзагрузка ресурсов: все изображения загружаются до старта игрового цикла (Promise + async/await).
Ограничение dt: максимальное значение 0.033 сек для стабильности физики и предотвращения проскока коллизий.
Централизованная конфигурация: все игровые параметры вынесены в js/config.js.

Описание игры
2D платформер-раннер. Игрок управляет велосипедистом, перемещается по уровню, прыгает по платформам и земле. Цель — добраться до правого края уровня, собирая по пути колёса. При касании правой границы уровень считается пройденным, игрок автоматически движется вправо (autoMove = true), и через 2 секунды загружается следующий уровень (level1 → level2). При падении вниз (за пределы уровня) — Game Over с возможностью рестарта.

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
│   ├── world.js                   # создаёт window.game.world (управление уровнем, фоном, генерация колёс)
│   ├── player.js                  # создаёт window.game.player (данные, движение, анимация, отрисовка, сбор колёс)
│   ├── collision.js               # обработка столкновений игрока с платформами
│   ├── camera.js                  # создаёт window.game.camera (камера)
│   ├── controls.js                # клавиатура и тач-зоны
│   ├── core/
│   │   ├── canvas.js              # инициализация canvas, resizeCanvas, rebuildWorld
│   │   └── layers.js              # система слоёв
│   ├── entities/
│   │   ├── platform.js            # класс Platform
│   │   └── wheel.js               # класс Wheel (собираемый предмет с анимацией)
│   ├── background/
│   │   ├── skybackground.js       # заливка неба
│   │   ├── sky.js                 # облака с ветром, параллакс, зацикливание
│   │   ├── mountains.js           # фон (горы/заводы) с тайлингом и масштабированием
│   │   └── rocks.js               # камни на земле
│   └── utils/
│       └── math.js
├── levels/
│   ├── level1.js                  # данные уровня 1 (платформы, колёса, фон)
│   └── level2.js                  # данные уровня 2 (платформы, колёса, фон)
└── assets/
    ├── player/
    │   └── player.png             # спрайт игрока (16x16, 17 кадров)
    ├── mountains/
    │   └── mountains-bg.png
    ├── industrial/
    │   └── factories-bg.png       # фон заводов для второго уровня
    ├── objects/
    │   └── wheel.png              # спрайт-лист колеса (1512x203, 7 кадров)
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

debugMode – флаг для отображения отладочной информации (переключается клавишей ё/~).

wheelsCollected – количество собранных колёс на текущем уровне.

player – ссылка на объект игрока.

world – ссылка на объект мира.

camera – ссылка на объект камеры.

gameOverUI – ссылка на объект UI окончания игры.

Методы:

restart() – перезапускает текущий уровень, сбрасывает состояние игрока и флаги.

drawDebug() – отображает отладочную информацию (хитбокс, координаты, Coyote Time) при включённом debugMode.

window.game.player
Поля:

x, y – координаты левого верхнего угла хитбокса.

width, height – размеры хитбокса (CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT).

speed, vy, gravity, jumpPower – параметры движения.

onGround – находится ли игрок на твёрдой поверхности.

moveLeft, moveRight, autoMove – состояние управления и автодвижения.

sprite – изображение игрока.

Анимационные поля (frameX, frameTimer, frameInterval и т.д.).

coyoteTimer – таймер для Coyote Time.

hitboxOffsetX – смещение хитбокса относительно визуальной позиции.

Методы:

jump() – прыжок, если игрок на земле или активен Coyote Time, и игра не завершена.

draw(ctx, camera) – отрисовка спрайта с центрированием относительно узкого хитбокса.

initPosition() – устанавливает начальную позицию на земле текущего уровня.

update(dt) – обновляет физику, коллизии, анимацию, Coyote Time и сбор колёс.

window.game.world
Поля: sky, mountains, currentLevel.

Методы:

setLevel(level) – переключает уровень, генерирует платформы, колёса (generateWheels), сбрасывает состояние игрока и камеры, переключает фон (если у уровня есть поле backgroundImage, загружает соответствующее изображение через mountains.setImage() или mountains.load()).

generateWheels(level) – создаёт объекты Wheel из level.wheelsData.

getGroundBase() – возвращает groundY текущего уровня.

update(dt) – обновляет фон и колёса (анимацию).

drawWheels(ctx, camera) – рисует все колёса текущего уровня.

draw(ctx, camera) – рисует фон.

window.game.camera
Поля: x, y, initialized.
Метод update():

Горизонтальное следование с отступом CAMERA_HORIZONTAL_OFFSET.

Вертикальное плавное следование с ограничением снизу (земля на CAMERA_GROUND_TARGET высоты экрана).

Проверки на NaN и корректность canvas/player.y.

window.game.gameOverUI
Управляет оверлеем #game-over. Методы show(isComplete), hide(). Кнопка рестарта вызывает window.game.restart().

Wheel (класс)
Поля: x, y, width, height, collected, currentFrame, accumulator.
Методы:

update(dt) – обновляет анимацию.

draw(ctx, camera) – отрисовка текущего кадра из спрайт-листа wheel.png (или красный круг, если спрайт не загружен).

collect(player) – проверяет столкновение с игроком; при сборе возвращает true и помечает колесо как собранное.

Фоновые объекты
sky, mountains, rocks, skybackground – остаются глобальными, но используют window.game.world.currentLevel для получения данных уровня. Их параметры вынесены в CONFIG.

Особенности mountains.js
Поддерживает динамическую смену текстуры (горы/заводы) через методы load(src) и setImage(imgElement, src).

При отрисовке учитывает масштаб (CONFIG.BACKGROUND_SCALE), что позволяет увеличивать/уменьшать фоновое изображение независимо для каждого уровня.

Рисуется с тайлингом по горизонтали, привязан к земле уровня с учётом MOUNTAINS_BURY_FACTOR.

Platform (класс)
Конструктор (x, y, width, height, passableFromBelow = true).
draw(ctx, camera) – рисует коричневый прямоугольник.
Флаг passableFromBelow: если true (по умолчанию), игрок может проходить сквозь платформу снизу.

collision.js (модуль)
Функция handleCollisions(player, level):

Использует player.prevY для корректных вертикальных проверок.

Обрабатывает приземление и столкновение головой (если платформа не проходима снизу).

Выполняет горизонтальное разрешение.

Возвращает { onGround }.

Конфигурация (CONFIG)
Все настройки игры хранятся в js/config.js и доступны через window.CONFIG. Основные параметры:

Категория	Параметр	Описание
Игрок	PLAYER_SRC_VISIBLE_X/Y/W/H	Область спрайта, которая визуально отображается (в пикселях исходного кадра)
PLAYER_SCALE	Масштаб видимой области до итогового размера хитбокса
PLAYER_WIDTH, PLAYER_HEIGHT	Размеры хитбокса (узкие, под ноги)
PLAYER_DRAW_WIDTH	Ширина отрисовки (может быть больше хитбокса для лучшего вида)
PLAYER_SPEED, PLAYER_GRAVITY, PLAYER_JUMP_POWER	Движение и прыжок
PLAYER_FRAME_WIDTH/HEIGHT, PLAYER_FRAME_COUNT, PLAYER_FRAME_INTERVAL	Анимация
PLAYER_START_X	Начальная позиция игрока по X
PLAYER_COYOTE_TIME	Время (сек), в течение которого можно прыгнуть после отрыва
Колёса	WHEEL_FRAME_W	Ширина одного кадра в спрайт-листе (216)
WHEEL_SPRITE_SRC_Y, WHEEL_SPRITE_SRC_H	Смещение и высота видимой области
WHEEL_FRAME_COUNT	Количество кадров анимации (7)
WHEEL_FRAME_INTERVAL	Интервал смены кадров (сек)
WHEEL_DRAW_SIZE	Размер отрисовки на экране (32)
Камера	CAMERA_HORIZONTAL_OFFSET, CAMERA_VERTICAL_SMOOTHING, CAMERA_GROUND_TARGET	Параметры камеры
Физика	MAX_DT, MIN_FRAME, MAX_FRAME, FINISH_THRESHOLD, AUTO_MOVE_EXTRA, FALL_LIMIT_OFFSET	Ограничения шага, условия финиша и падения
Фон	SKY_CLOUD_WRAP_MARGIN, SKY_WIND_SPEED, SKY_PARALLAX	Облака
MOUNTAINS_BURY_FACTOR	Позиционирование гор/заводов
ROCKS_PER_PLATFORM, ROCKS_MARGIN	Генерация камней
BACKGROUND_MOUNTAINS, BACKGROUND_FACTORIES	Пути к файлам фоновых изображений
BACKGROUND_SCALE	Объект с масштабами для каждого фона (ключ – путь к изображению, значение – коэффициент масштаба)
Управление	TOUCH_MOVE_ZONE_*, TOUCH_JUMP_ZONE_*, TOUCH_SWIPE_THRESHOLD	Размеры и положение тач-зон
Отладка	DEBUG_FONT, DEBUG_COLOR	Стиль отладочного текста
Уровни	LEVEL_SWITCH_DELAY	Задержка перед переключением уровня (мс)
Система слоёв
layers.js предоставляет глобальный layers с массивами: background, midground, world, actors, foreground, ui.
Функции: addToLayer(layer, obj), clearLayer(layer), drawLayers(ctx, camera).
В rebuildWorld() платформы уровня добавляются в слой world.
Колёса не используются в слоях – они отрисовываются напрямую через world.drawWheels, что гарантирует синхронизацию анимации.

Управление
Клавиатура: стрелки / A/D — движение, пробел — прыжок.

Клавиша ё/~: включает/выключает отладочный режим (хитбокс и информация).

Тач-зоны: левая зона (круг) – движение влево/вправо по смещению пальца; правая зона (круг) – прыжок.

Рестарт: через DOM-кнопку #restart-button (обработчик вызывает window.game.restart()).

Данные уровней
level1.js и level2.js содержат объекты с полями:

number – номер уровня.

width, height – размеры уровня.

groundY – Y-координата земли.

platformData[] – массив данных для платформ (x, offset, w, h).

groundPlatforms[] – создаются в generate() для физической земли.

wheelsData[] – массив объектов { x, y } с позициями колёс.

backgroundImage – путь к фоновому изображению (используется в world.setLevel() для смены фона).

Метод generate() – создаёт платформы из platformData и groundPlatforms.

Колёса создаются централизованно в world.generateWheels.

Предзагрузка изображений
Все графические ресурсы загружаются асинхронно до запуска игрового цикла.
Реализована функция loadAllImages(), возвращающая Promise.
В main.js создаётся глобальный объект window.preloadedBackgrounds, где ключ – путь к файлу, значение – загруженное Image. Это позволяет быстро переключать фоны без повторной загрузки.
После загрузки выставляется rocks.loaded = true, и игра стартует.

Инициализация игры
В main.js после загрузки страницы:

Вызов loadAllImages() – предзагрузка всех изображений (игрок, оба фона, камни, колёса).

После успешной загрузки: привязка window.game.world.sky и window.game.world.mountains.

Установка начального фона для mountains (горы).

Вызов window.game.world.setLevel(level1), добавление объектов в слои, вызов resizeCanvas() и rebuildWorld().

Запуск игрового цикла.

Игровой цикл (main.js)
requestAnimationFrame(gameLoop), вычисление dt с ограничением CONFIG.MAX_DT.

Обновление: camera.update(), player.update(dt), world.update(dt).

Отрисовка: drawLayers(), player.draw(), drawUI(), drawWheelCounter(), world.drawWheels(), drawDebug().

Счётчик колёс: отображается в правом верхнем углу.

Обработка game.state.gameOver: при завершении уровня переключение на следующий с задержкой LEVEL_SWITCH_DELAY.

Рестарт и переключение уровней
window.game.restart() проверяет флаг restarting, перегенерирует текущий уровень, камни, колёса, сбрасывает позицию игрока, autoMove, счётчик колёс и скрывает оверлей.

При переключении уровня через setLevel также вызывается rocks.generate() и generateWheels, а также смена фона через mountains.setImage() или mountains.load().

Флаг nextLevelQueued предотвращает повторный запуск таймаута.

Управление canvas и миром
В canvas.js определены:

resizeCanvas() – обновляет размеры canvas и масштаб. Вызывается при изменении размера окна или повороте экрана.

rebuildWorld() – перестраивает платформы из текущего уровня (очищает слой world и добавляет платформы заново).

Отладка
Включение/выключение отладочного режима клавишей ё/~.

При включённом режиме отображается:

Полупрозрачный зелёный хитбокс игрока.

Текстовая информация: координаты игрока, уровень, статус, размер хитбокса, таймер Coyote Time.

Координаты углов хитбокса.

Удалённый мёртвый код и основные рефакторинги
Удалены неиспользуемые методы и переменные (Platform.checkCollision, world.clouds, restartButton и др.).

Глобальные функции перенесены в window.game.

Вызовы rocks.generate() централизованы в world.setLevel.

Генерация колёс вынесена в world.generateWheels (не дублируется в каждом уровне).

Система слоёв для колёс заменена прямой отрисовкой, чтобы избежать рассогласования анимации.

Добавлена поддержка смены фона по уровням (горы на первом уровне, заводы на втором) с возможностью индивидуального масштабирования через CONFIG.BACKGROUND_SCALE.

Последнее обновление: после внедрения динамической смены фона и масштабирования.