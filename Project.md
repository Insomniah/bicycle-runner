PROJECT.md — Bicycle Runner
Движок и язык
Чистый JavaScript (ES6) + HTML5 Canvas

Без фреймворков

Адаптация под мобильные устройства (тач-зоны, ориентация, viewport)

Предзагрузка ресурсов: все изображения загружаются до старта игрового цикла (Promise + async/await)

Ограничение dt: максимальное значение 0.033 сек для стабильности физики и предотвращения проскока коллизий

Описание игры
2D платформер-раннер. Игрок управляет велосипедистом, перемещается по уровню, прыгает по платформам и земле. Цель — добраться до правого края уровня. При касании правой границы уровень считается пройденным, игрок автоматически движется вправо (autoMove = true), и через 2 секунды загружается следующий уровень (level1 → level2). При падении вниз (за пределы уровня) — Game Over с возможностью рестарта.

Структура проекта (актуальная)
text
bicycle-runner/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js                    # игровой цикл, предзагрузка изображений, инициализация через world.setLevel, рестарт, debug
│   ├── game.js                    # canvas, gameOverUI, адаптация
│   ├── world.js                   # глобальный объект world (управление уровнем, фоном)
│   ├── player.js                  # объект player, логика движения, гравитация, коллизии, autoMove
│   ├── camera.js                  # камера
│   ├── controls.js                # клавиатура и тач-зоны
│   ├── core/
│   │   ├── canvas.js              # инициализация canvas, resize, recalcScene
│   │   └── layers.js              # система слоёв
│   ├── entities/
│   │   └── platform.js            # класс Platform (только конструктор, draw)
│   ├── background/
│   │   ├── skybackground.js       # заливка неба
│   │   ├── sky.js                 # облака с ветром, параллакс, зацикливание по ширине уровня
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
Ключевые глобальные объекты и классы
window.player
Поля: x, y, width, height, speed, vy, gravity, jumpPower, onGround, moveLeft, moveRight, autoMove (используется после финиша), sprite, анимационные поля.

Методы: jump().

Коллизии: обрабатываются в updatePlayer() (цикл по level.platforms и level.groundPlatforms).

Анимация: обновляется по таймеру, отрисовка с зеркалированием.

Защита отрисовки: drawPlayer проверяет player.sprite.complete перед рисованием.

window.world
Поля: sky, mountains, currentLevel.

Методы:

setLevel(level) — переключает уровень, вызывает level.generate(), инициализирует позицию игрока, сбрасывает player.autoMove, moveLeft, moveRight, сбрасывает камеру, генерирует фон (sky.generate(), mountains.generate()), устанавливает gameOver = false.

getGroundBase() — делегирует текущему уровню.

update() — обновляет фон (sky, mountains).

draw(ctx, camera) — рисует фон.

window.camera
Горизонтальное следование с отступом 35% от левого края.

Вертикальное плавное следование с ограничением снизу (земля на 75% высоты экрана).

window.gameOverUI
Управляет оверлеем #game-over. Методы show(isComplete), hide(). Кнопка рестарта вешает обработчик один раз (в init()).

window.rocks
Асинхронная загрузка изображений, генерация камней на groundPlatforms уровня (по 4 камня на платформу). Вызывается при старте и при смене уровня.

sky и mountains
sky: генерация облаков по ширине уровня, движение с ветром, параллакс 0.2. Зацикливание реализовано через условие if (cloud.x < -cloud.w) cloud.x = level.width + 300; else if (cloud.x > level.width + 300) cloud.x = -cloud.w;.

mountains: тайлинг по горизонтали, привязка к земле, утапливание на 40%.

Platform (класс)
Конструктор (x, y, width, height).

draw(ctx, camera) — рисует прямоугольник.

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

Вызов loadAllImages() — предзагрузка всех изображений (спрайт игрока, горы, камни).
После успешной загрузки: регистрация world.sky и world.mountains, вызов world.setLevel(level1), rocks.generate(), добавление объектов в слои, recalcScene(), запуск игрового цикла.
Если загрузка изображений не удалась, ошибка логируется в консоль, игра не стартует (можно добавить UI-сообщение).

Игровой цикл (main.js)
requestAnimationFrame(gameLoop), вычисление dt.

Ограничение dt: максимальное значение 0.033 сек, чтобы избежать проскока платформ при низком FPS.

Проверки существования: перед вызовом camera.update(), updatePlayer(), world.update(), drawUI(), gameOverUI.show/hide добавлены проверки на наличие соответствующих объектов.

Флаг restarting: предотвращает повторный вызов restartLevel() во время переключения уровней.

Обновление: camera.update(), updatePlayer(dt), world.update().

Отрисовка: drawLayers(ctx, camera), drawPlayer(ctx, camera), drawUI(), drawDebug().

Обработка gameOver:

Если gameOver === "complete" — устанавливается player.autoMove = true, игрок автоматически движется вправо; через 2 секунды вызывается world.setLevel(level2), rocks.generate(), recalcScene(), после чего autoMove сбрасывается.

Если gameOver === "fail" — показывается оверлей Game Over.

Рестарт и переключение уровней
restartLevel() проверяет флаг restarting и устанавливает его, чтобы избежать повторного рестарта. После выполнения флаг сбрасывается.

При переключении уровня (world.setLevel) также вызывается rocks.generate() для обновления камней под новый уровень.

В таймауте переключения уровня установлен флаг nextLevelQueued, предотвращающий повторный запуск.

Предзагрузка изображений
Все графические ресурсы (спрайт игрока, горы, камни) загружаются асинхронно до запуска игрового цикла.

Реализована функция loadAllImages(), возвращающая Promise.

После загрузки выставляется rocks.loaded = true, и игра стартует.

Это исключает ситуацию, когда игрок видит пустые или частично загруженные текстуры.

Удалённый мёртвый код (важно для нейросети)
Удалён метод Platform.checkCollision().

Удалены поля world.clouds и метод world.addCloud().

Удалены переменные restartButton в main.js и controls.js, а также связанные обработчики на canvas.

Удалён дублирующий обработчик кнопки рестарта в game.js.

Удалена неиспользуемая функция getSceneScale() в canvas.js.

Удалены ручные вызовы level1.generate(), level2.generate(), sky.generate(), mountains.generate() при старте — теперь всё через world.setLevel.