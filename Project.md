Движок и язык
Чистый JavaScript (ES6) + HTML5 Canvas. Без фреймворков. Адаптация под мобильные устройства, предзагрузка ресурсов, ограничение dt ≤ 0.033 сек. Централизованная конфигурация в js/config.js.

Игровой процесс
2D платформер-раннер. Игрок управляет велосипедистом, собирает колёса и достигает правого края уровня. При касании правой границы уровень завершается, игрок автоматически движется вправо, и через 2 секунды загружается следующий уровень (level1 → level2). Падение вниз → Game Over с возможностью рестарта.

Структура проекта (актуальная)
text
bicycle-runner/
├── index.html
├── css/styles.css
├── js/
│   ├── config.js
│   ├── main.js
│   ├── game.js
│   ├── world.js
│   ├── player.js
│   ├── collision.js
│   ├── camera.js
│   ├── controls.js
│   ├── core/canvas.js, layers.js
│   ├── entities/platform.js, wheel.js
│   ├── scenery/                     # бывшая папка background
│   │   ├── background.js            # универсальный фон (горы/заводы)
│   │   ├── decorations.js           # декорации на земле (камни / шины)
│   │   ├── sky.js, skybackground.js
│   └── utils/math.js
├── levels/level1.js, level2.js
└── assets/
    ├── player/player.png
    ├── mountains/mountains-bg.png
    ├── industrial/factories-bg.png
    ├── tires/tire-1.png, tire-2.png
    ├── objects/wheel.png
    └── rocks/*.png
Ключевые глобальные объекты
window.game – состояние (gameOver, debugMode, wheelsCollected), методы restart(), drawDebug().

window.game.player – физика, прыжок, анимация, сбор колёс.

window.game.world – текущий уровень, фон, платформы, генерация колёс.

window.game.camera – следование за игроком.

window.game.gameOverUI – оверлей окончания игры.

background – универсальный фон с динамической сменой текстуры и масштабированием.

decorations – декорации на земле: камни (уровень 1) или шины (уровень 2).

Фон (динамическая смена)
background.js предоставляет методы load(src) и setImage(img, src), учитывает масштаб из CONFIG.BACKGROUND_SCALE.

Уровни содержат поле backgroundImage (например, CONFIG.BACKGROUND_FACTORIES для level2).

В world.setLevel() фон переключается автоматически.

Декорации земли (камни / шины)
decorations.js загружает два набора изображений: rockTypes и tireTypes.

В generate() проверяется level.number === 2: для второго уровня используются шины, для первого – камни.

Шины отрисовываются с масштабом 0.5 (уменьшены) и в большем количестве на платформу (8 вместо 4).

Методы setRockImages() / setTireImages() получают изображения из main.js после предзагрузки.

Цвет неба
Каждый уровень может содержать поле skyColor. Если оно не задано, используется CONFIG.DEFAULT_SKY_COLOR (чёрный).

В skybackground.js цвет заливки берётся из текущего уровня.

Данные уровней
Каждый уровень (level1.js, level2.js) содержит:

number, width, height, groundY

platformData[] для платформ

wheelsData[] для позиций колёс

backgroundImage – путь к фону

skyColor – цвет неба (опционально)

метод generate(), создающий platforms и groundPlatforms

Предзагрузка и инициализация
loadAllImages() загружает спрайты игрока, оба фона, камни, шины и колёса. Результаты сохраняются в window.preloadedBackgrounds и передаются в decorations. После загрузки стартует игровой цикл.

Игровой цикл (main.js)
Обновление: camera.update(), player.update(dt), world.update(dt).

Отрисовка: слои, игрок, колёса, счётчик, отладка.

При gameOver === "complete" через задержку переключается уровень (вызов world.setLevel(level2)).

При рестарте (падение в яму) вызывается generateWheels() для пересоздания колёс.

Управление
Клавиатура: стрелки / A/D – движение, пробел – прыжок.

Клавиша ё/~ – включение отладки (хитбокс, координаты, Coyote Time).

Тач-зоны (левая – движение, правая – прыжок).

Кнопка рестарта в оверлее.

Конфигурация (config.js)
Содержит все настройки: параметры игрока, камеры, физики, фона (пути к изображениям + BACKGROUND_SCALE), колёс, управления, отладки, задержку переключения уровней, цвет неба по умолчанию.

Последние изменения
Динамическая смена фона – объект mountains переименован в background, папка background переименована в scenery. Фон переключается по полю backgroundImage в данных уровня.

Шины на втором уровне – в decorations.js добавлены tireTypes, логика выбора изображений по номеру уровня, масштабирование шин и увеличенное количество.

Цвет неба по уровням – добавлено поле skyColor в level1.js и level2.js, skybackground.js использует цвет из уровня или CONFIG.DEFAULT_SKY_COLOR.

Исправлен баг рестарта колёс – в window.game.restart() добавлен вызов generateWheels(), теперь колёса пересоздаются после падения в яму.

Предзагрузка шин – расширена функция loadAllImages() для загрузки tire-1.png и tire-2.png.

Масштабирование фона – в background.js добавлена поддержка CONFIG.BACKGROUND_SCALE.

Актуально после рефакторинга фона, добавления шин, смены цвета неба и исправления рестарта колёс.