PROJECT.md — Bicycle Runner
Движок и язык
Чистый JavaScript (ES6) + HTML5 Canvas

Без фреймворков, вся логика самописная

Адаптация под мобильные устройства (тач-зоны, ориентация, viewport, --vh)

Описание игры
2D платформер-раннер. Игрок управляет велосипедистом, перемещается по уровню, прыгает по платформам и земле. Цель — добраться до правого края уровня (финиш). При касании правой границы уровень считается пройденным, и через 2 секунды автоматически загружается следующий уровень (level1 → level2). При падении вниз (за пределы уровня) — Game Over с возможностью рестарта.

Структура проекта
text
bicycle-runner/
├── index.html
├── css/
│   └── styles.css                 # стили: скрытие скролла, canvas на весь экран, overlay для Game Over и rotateNotice
├── js/
│   ├── main.js                    # игровой цикл, инициализация, рестарт, debug-информация
│   ├── game.js                    # canvas, gameOverUI, адаптация размера (resize, orientation)
│   ├── world.js                   # глобальный объект world (управление уровнем, фоновыми объектами)
│   ├── player.js                  # объект player, логика движения, гравитация, коллизии с платформами, анимация
│   ├── camera.js                  # камера, след за игроком с плавностью и ограничениями
│   ├── controls.js                # обработка клавиатуры (стрелки, A/D, пробел) и тач-зон (движение слева, прыжок справа)
│   ├── core/
│   │   ├── canvas.js              # инициализация canvas, resize, recalcScene (пересборка слоёв мира)
│   │   └── layers.js              # система слоёв (background, midground, world, actors, foreground, ui) с функциями addToLayer, clearLayer, drawLayers
│   ├── entities/
│   │   ├── platform.js            # класс Platform (x, y, w, h) с методом draw и checkCollision (последний не используется)
│   │   └── enemy.js               # (пока не используется)
│   ├── background/
│   │   ├── skybackground.js       # сплошная заливка неба (голубой)
│   │   ├── sky.js                 # облака с ветром, параллаксом, генерацией по ширине уровня
│   │   ├── mountains.js           # горы, тайлинг по горизонтали, привязка к земле
│   │   └── rocks.js               # камни на земле, генерируются на groundPlatforms уровня, загрузка изображений
│   └── utils/
│       └── math.js                # (возможно, вспомогательные функции)
├── levels/
│   ├── level1.js                  # данные уровня 1: ширина, высота, groundY, platformData, groundPlatforms, метод generate()
│   └── level2.js                  # данные уровня 2 (аналогично, но меньше платформ и ширина 2000)
└── assets/
    ├── player/
    │   └── player.png             # спрайт игрока (16x16, 17 кадров)
    ├── mountains/
    │   └── mountains-bg.png
    └── rocks/
        └── middle_lane_rock1_*.png
Ключевые глобальные объекты и классы
window.player (объект)
Поля: x, y, width, height, speed, vy, gravity, jumpPower, onGround, moveLeft, moveRight, autoMove, prevY, sprite, анимационные поля (frameX, frameY, frameWidth, frameHeight, frameCount, frameTimer, frameInterval).

Методы: jump() (устанавливает vy = jumpPower и сбрасывает onGround).

Коллизии: реализованы в updatePlayer() (цикл по level.platforms и level.groundPlatforms), проверка падения, финиша.

Анимация: обновляется по таймеру, отрисовка с учётом направления (зеркалирование при moveLeft).

window.world (объект)
Поля: sky, mountains, clouds[], currentLevel.

Методы:

setLevel(level) — переключает уровень, вызывает level.generate(), инициализирует позицию игрока, сбрасывает камеру, генерирует фон.

getGroundBase() — делегирует текущему уровню.

update() — обновляет sky, mountains, облака.

draw(ctx, camera) — рисует фон.

window.camera (объект)
Поля: x, y, initialized.

Метод update():

Горизонталь: x = player.x - canvas.width * 0.35, ограничена границами уровня.

Вертикаль: плавное следование за игроком (lerp), ограничение снизу на уровне земли (чтобы земля была на 75% высоты экрана).

window.gameOverUI (объект)
Управляет элементом #game-over. Методы show(isComplete) и hide(). При рестарте вызывает restartLevel().

window.rocks (объект)
Поля: list[], rockTypes[], images[], loaded.

Метод generate() — загружает изображения асинхронно, затем генерирует камни на каждой groundPlatform уровня (по 4 камня, с отступами).

Метод draw(ctx, camera) — отрисовка с учётом камеры.

sky и mountains (объекты)
sky: генерация облаков по ширине уровня, движение с ветром, параллакс 0.2.

mountains: тайлинг по горизонтали, привязка к земле, утапливание на 40%.

Platform (класс)
Конструктор: x, y, width, height.

draw(ctx, camera) — рисует коричневый прямоугольник.

checkCollision(player) — не используется (коллизии обрабатываются отдельно в player.js).

Система слоёв
layers.js определяет глобальный объект layers с массивами для каждого слоя.

Функции: addToLayer(layer, obj), clearLayer(layer), drawLayers(ctx, camera).

Используемые слои: background, midground, world, actors, foreground, ui.

В recalcScene() платформы уровня добавляются в слой world.

Управление
Клавиатура: стрелки / A/D — движение, пробел — прыжок.

Тач-управление:

Левая зона (круг радиусом 100px, центр (150, canvas.height-150)) — движение влево/вправо по горизонтальному смещению пальца.

Правая зона (круг радиусом 80px, центр (canvas.width-150, canvas.height-150)) — прыжок.

Зоны управления отображаются полупрозрачными чёрными кругами на мобильных устройствах.

Данные уровней
level1.js и level2.js содержат объекты с полями:

number, width, height, groundY.

platformData[] — массив объектов с x, offset, w, h (offset — высота над землёй).

platforms[] и groundPlatforms[] — заполняются в generate() объектами Platform.

getGroundBase() возвращает groundY.

После загрузки уровня вызывается generate(), создающий платформы и землю.

Игровой цикл (в main.js)
requestAnimationFrame(gameLoop), вычисление dt.

camera.update(), updatePlayer(dt), world.update().

Отрисовка: drawLayers(ctx, camera), затем drawPlayer(ctx, camera), drawUI() (тач-зоны), drawDebug().

Проверка gameOver:

Если gameOver === "complete" — через 2 секунды переключается на следующий уровень (world.setLevel(level2)) и сбрасывает состояние.

Если gameOver === "fail" — отображается Game Over с кнопкой рестарта.

Рестарт и переключение уровня
restartLevel() — вызывает world.currentLevel.generate(), rocks.generate(), recalcScene(), initPlayerPosition(), сбрасывает gameOver = false, прячет gameOverUI.

Переключение уровня в цикле: после gameOver === "complete" вызывается world.setLevel(level2).

Стили (styles.css)
html, body: margin:0; padding:0; overflow:hidden; user-select:none; touch-action:none.

#gameCanvas: display:block; width:100vw; height:100vh.

#rotateNotice: полноэкранный оверлей, появляется при вертикальной ориентации.

#game-over: полноэкранный оверлей с текстом и кнопкой рестарта.

Важные глобальные функции
initPlayerPosition() — устанавливает игрока на level.getGroundBase() - player.height и сбрасывает скорость.

recalcScene() — вызывается при изменении размера экрана или загрузке: обновляет размер canvas, перегенерирует платформы уровня и добавляет их в слой world.

drawUI() — рисует тач-зоны.

drawDebug() — выводит техническую информацию (позиция игрока, уровень, статус).