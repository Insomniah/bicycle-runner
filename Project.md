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
    │   └── player.png
    ├── mountains/
    │   └── mountains-bg.png
    └── rocks/
        └── *.png
Ключевые глобальные объекты
### `window.game`
- **Объект, инкапсулирующий состояние игры и ключевые подсистемы.**
- **Поля**:
  - `state`: объект с полями:
    - `gameOver` – текущий статус игры (`false`, `"complete"`, `"fail"`).
    - `nextLevelQueued` – флаг, предотвращающий повторный запуск переключения уровня.
    - `restarting` – флаг, предотвращающий повторный вызов рестарта.
  - `player` – ссылка на объект игрока (см. выше).
  - `gameOverUI` – ссылка на объект UI окончания игры.

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

Система слоёв
layers.js предоставляет глобальный layers с массивами: background, midground, world, actors, foreground, ui.

Функции: addToLayer(layer, obj), clearLayer(layer), drawLayers(ctx, camera).

В rebuildWorld() (ранее recalcScene) платформы уровня добавляются в слой world.

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
После успешной загрузки: регистрация world.sky и world.mountains, вызов world.setLevel(level1), rocks.generate(), добавление объектов в слои, вызов resizeCanvas() (установка размеров canvas) и rebuildWorld() (построение платформ), запуск игрового цикла.
Если загрузка изображений не удалась, ошибка логируется в консоль, игра не стартует.

Игровой цикл (main.js)
requestAnimationFrame(gameLoop), вычисление dt с ограничением CONFIG.MAX_DT.

Обновление: camera.update(), updatePlayer(dt), world.update().

Отрисовка: drawLayers(ctx, camera), game.player.draw(ctx, camera), drawUI(), drawDebug().

- **Обработка `game.state.gameOver`**:
  - Если `game.state.gameOver === "complete"` – устанавливается `game.player.autoMove = true`, через `CONFIG.LEVEL_SWITCH_DELAY` вызывается `world.setLevel(level2)`, `rocks.generate()`, `rebuildWorld()`, сброс флагов `game.state.nextLevelQueued` и `game.state.gameOver`.
  - Если `game.state.gameOver === "fail"` – показывается оверлей Game Over.

Рестарт и переключение уровней
- `restartLevel()` проверяет флаг `game.state.restarting` (предотвращает повторный вызов), перегенерирует текущий уровень, камни, вызывает `rebuildWorld()`, сбрасывает позицию игрока, `autoMove` и движение, сбрасывает `game.state.gameOver` и скрывает оверлей.
- При переключении уровня (`world.setLevel`) также вызывается `rocks.generate()` для обновления камней.
- В таймауте переключения уровня установлен флаг `game.state.nextLevelQueued`, предотвращающий повторный запуск.

Предзагрузка изображений
Все графические ресурсы загружаются асинхронно до запуска игрового цикла.

Реализована функция loadAllImages(), возвращающая Promise.

После загрузки выставляется rocks.loaded = true, и игра стартует.

Управление canvas и миром
В canvas.js определены две ключевые функции:

resizeCanvas() – обновляет размеры canvas и масштаб. Вызывается при изменении размера окна или повороте экрана.

rebuildWorld() – перестраивает платформы из текущего уровня (очищает слой world и добавляет платформы заново). Вызывается при старте, рестарте и смене уровня.

Такое разделение позволяет изменять размер окна без сброса состояния игры (игрок остаётся на месте, прогресс не теряется).

Удалённый мёртвый код (важно для нейросети)
Удалён метод Platform.checkCollision().

Удалены поля world.clouds и метод world.addCloud().

Удалены переменные restartButton в main.js и controls.js, а также связанные обработчики на canvas.

Удалён дублирующий обработчик кнопки рестарта в game.js.

Удалена неиспользуемая функция getSceneScale() в canvas.js.

Удалены ручные вызовы level1.generate(), level2.generate(), sky.generate(), mountains.generate() при старте — теперь всё через world.setLevel.

Удалена старая функция drawPlayer из player.js (теперь отрисовка внутри game.player.draw).

Удалена функция recalcScene() – заменена на resizeCanvas() и rebuildWorld().